import { useEffect, useState, useCallback } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { autorun, toJS } from 'mobx';

import { NameValueList } from 'shared/model';

import {
  findAllMenu,
  registerMenu,
  removeMenu,
  modifyMenu,
  registerMenuAndDiscussion,
  setCommunityMenuOrder,
} from '../api/MenuApi';
import { MenuViewModel } from '../model/Menu';
import MenuStore from '../mobx/MenuStore';
import { fromViewModel } from '../model/MenuCdo';
import { fromViewModelToDiscussionCdo } from '../model/MenuDiscussionCdo';
import { setViewModelToDiscussionUdo } from '../model/MenuDiscussionUdo';
import { getEmptyMenuTransaction } from '../model/MenuTransaction';
import { getEmptyRelatedUrl } from '../model/RelatedUrl';

export type Loading = boolean;

export interface AppendMenu {
  (): void;
}

export interface AppendSubMenu {
  (): void;
}

export interface RemoveMenu {
  (id: string): void;
}

export interface Save {
  (): void;
}

function requestMenuList(communityId: string) {
  findAllMenu(communityId).then((next) => {
    if (next !== undefined) {
      MenuStore.instance.setMenuList(
        next.map((c) => ({
          ...c,
          parentId: c.parentId === null ? undefined : c.parentId,
          menuId: c.menuId === null ? '' : c.menuId,
          relatedUrlList: c.relatedUrlList === undefined ? [getEmptyRelatedUrl()] : c.relatedUrlList,
        }))
      );
      MenuStore.instance.select(null);
      MenuStore.instance.menuTransaction = getEmptyMenuTransaction();
    }
  });
}

async function save(communityId: string) {
  const menuStore = MenuStore.instance;
  const appendMenus = menuStore.menuList.filter(
    (c) => c.parentId === undefined && menuStore.menuTransaction.appendIds.includes(c.id)
  );
  const appendSubMenus = menuStore.menuList.filter(
    (c) => c.parentId !== undefined && menuStore.menuTransaction.appendIds.includes(c.id)
  );

  const tempIdDataIdMap = new Map<string, string>();

  for await (const [id, namevalueList] of menuStore.menuTransaction.modifieds.entries()) {
    const next = MenuStore.instance.menuList.find((c) => c.id === id);
    if (next === undefined) {
      break;
    }

    let name = next.name;
    const type = next.type;
    let discussionTopic = next.discussionTopic;
    let content = next.content === undefined ? '' : next.content;
    let fileBoxId = next.fileBoxId;
    let relatedUrlList = next.relatedUrlList === undefined ? [getEmptyRelatedUrl()] : next.relatedUrlList;
    let privateComment = next.privateComment;
    let accessType = next.accessType === undefined ? 'COMMUNITY_ALL_MEMBER' : next.accessType;
    let groupId = next.groupId === undefined ? '' : next.groupId;

    //nameValuelist 초기 설정
    const menuNameList = new NameValueList();

    for await (const NameValue of namevalueList.nameValues) {
      if (NameValue.name === 'name') {
        name = NameValue.value;
        menuNameList.nameValues.push(NameValue);
      } else if (NameValue.name === 'discussionTopic') {
        discussionTopic = NameValue.value;
        menuNameList.nameValues.push(NameValue);
      } else if (NameValue.name === 'accessType') {
        if (NameValue.value === 'COMMUNITY_ALL_MEMBER') {
          accessType = 'COMMUNITY_ALL_MEMBER';
        } else {
          accessType = 'COMMUNITY_GROUP';
        }
        menuNameList.nameValues.push(NameValue);
      } else if (NameValue.name === 'groupId') {
        groupId = NameValue.value;
        menuNameList.nameValues.push(NameValue);
      } else if (NameValue.name === 'content') {
        content = NameValue.value;
      } else if (NameValue.name === 'fileBoxId') {
        fileBoxId = NameValue.value;
      } else if (NameValue.name === 'relatedUrlList') {
        relatedUrlList = JSON.parse(NameValue.value);
      } else if (NameValue.name === 'privateComment') {
        privateComment = NameValue.value === 'true' ? true : false;
      } else {
        menuNameList.nameValues.push(NameValue);
      }
    }

    const menuDiscussionUdo = setViewModelToDiscussionUdo(
      type,
      name,
      discussionTopic,
      name,
      content,
      fileBoxId,
      relatedUrlList,
      privateComment,
      accessType,
      groupId
    );
    await modifyMenu(type, communityId, id, menuNameList, name, discussionTopic, menuDiscussionUdo);
  }

  for await (const menu of appendMenus) {
    if (menu.type === 'DISCUSSION' || menu.type === 'ANODISCUSSION') {
      //토론하기   , 익명 토론하기
      const next = fromViewModelToDiscussionCdo(menu);
      const id = await registerMenuAndDiscussion(communityId, next);
      tempIdDataIdMap.set(menu.id, id);
    } else {
      const next = fromViewModel(menu);
      const id = await registerMenu(communityId, next);
      tempIdDataIdMap.set(menu.id, id);
    }
  }

  for await (const menu of appendSubMenus) {
    if (menu.type === 'DISCUSSION' || menu.type === 'ANODISCUSSION') {
      //토론하기
      const next = fromViewModelToDiscussionCdo(menu);
      if (tempIdDataIdMap.has(menu.parentId!)) {
        next.parentId = tempIdDataIdMap.get(menu.parentId!);
      }
      await registerMenuAndDiscussion(communityId, next);
    } else {
      const next = fromViewModel(menu);
      if (tempIdDataIdMap.has(menu.parentId!)) {
        next.parentId = tempIdDataIdMap.get(menu.parentId!);
      }
      await registerMenu(communityId, next);
    }
  }

  for await (const id of menuStore.menuTransaction.removeds) {
    await removeMenu(communityId, id);
  }

  //
  await setCommunityMenuOrder(communityId);

  await requestMenuList(communityId);
}

interface Params {
  communityId: string;
}

export function useMenuList(): [MenuViewModel[], AppendMenu, AppendSubMenu, RemoveMenu, Save, Loading] {
  const { params } = useRouteMatch<Params>();

  const [value, setValue] = useState<MenuViewModel[]>([]);
  const [loading, setLoading] = useState<Loading>(false);

  useEffect(() => {
    MenuStore.instance.clearMenuList();
    return autorun(() => {
      const list = toJS(MenuStore.instance.menuList);
      const next: MenuViewModel[] = [];
      list
        .filter((c) => c.parentId === undefined)
        .sort((a, b) => a.order - b.order)
        .forEach((c) => {
          next.push(c);
          list
            .filter((d) => d.parentId === c.id)
            .sort((a, b) => a.order - b.order)
            .forEach((d) => {
              next.push(d);
            });
        });
      setValue(next);
    });
  }, []);

  useEffect(() => {
    const { communityId } = params;
    if (communityId === undefined) {
      return;
    }
    requestMenuList(communityId);
  }, [params]);

  const appendMenu = useCallback(() => {
    if (MenuStore.instance.menuList.some((c) => c.editing === true)) {
      return;
    }
    MenuStore.instance.appendMenu();
  }, []);

  const appendSubMenu = useCallback(() => {
    if (MenuStore.instance.menuList.some((c) => c.editing === true)) {
      return;
    }
    MenuStore.instance.appendSubMenu();
  }, []);

  const removeMenu = useCallback((id: string) => {
    MenuStore.instance.removeMenu(id);
  }, []);

  const nextSave = useCallback(async () => {
    const { communityId } = params as any;
    if (communityId === undefined) {
      return;
    }
    setLoading(true);
    await save(communityId);
    setLoading(false);
  }, [params]);

  return [value, appendMenu, appendSubMenu, removeMenu, nextSave, loading];
}
