import { observable, action, computed } from 'mobx';
import { ObservableArray } from 'mobx/lib/internal';

import { NameValueList } from 'shared/model';

import MenuType from '../model/MenuType';
import AccessType from '../model/AccessType';
import RelatedUrl from '../model/RelatedUrl';
import { getEmptyMenu, MenuViewModel } from '../model/Menu';
import MenuTransaction, { getEmptyMenuTransaction } from '../model/MenuTransaction';
import MenuSurveyCdo, { getEmptyMenuSurveyCdo } from '../model/MenuSurveyCdo';

class MenuStore {
  static instance: MenuStore;

  constructor() {
    this.setMenuList = this.setMenuList.bind(this);
    this.appendMenu = this.appendMenu.bind(this);
    this.appendSubMenu = this.appendSubMenu.bind(this);
    this.removeMenu = this.removeMenu.bind(this);
    this.upMenu = this.upMenu.bind(this);
    this.downMenu = this.downMenu.bind(this);
    this.select = this.select.bind(this);
    this.changeName = this.changeName.bind(this);
    this.changeType = this.changeType.bind(this);
    this.changeAccessType = this.changeAccessType.bind(this);
    this.changeGroupId = this.changeGroupId.bind(this);
    this.changeUrl = this.changeUrl.bind(this);
    this.changeDiscussionTopic = this.changeDiscussionTopic.bind(this);
    this.changeSurveyInformation = this.changeSurveyInformation.bind(this);
    this.stopEditing = this.stopEditing.bind(this);
    this.pushNameValue = this.pushNameValue.bind(this);
    this.setSurveyTitle = this.setSurveyTitle.bind(this);
    this.setSurveyCreatorName = this.setSurveyCreatorName.bind(this);
    this.initSelected = this.initSelected.bind(this);

    this.changeDiscussionContent = this.changeDiscussionContent.bind(this);
    this.changeDiscussionFileBoxId = this.changeDiscussionFileBoxId.bind(this);
    this.changeDiscussionRelatedUrlList = this.changeDiscussionRelatedUrlList.bind(this);
    this.setDiscussionRelatedUrlList = this.setDiscussionRelatedUrlList.bind(this);
    this.minusDiscussionRelatedUrlList = this.minusDiscussionRelatedUrlList.bind(this);
    this.changeDiscussionPrivateComment = this.changeDiscussionPrivateComment.bind(this);
  }

  @observable
  innerMenuList: MenuViewModel[] = [];

  @action
  setMenuList(next: MenuViewModel[]) {
    this.innerMenuList = next;
  }

  @action
  clearMenuList() {
    //
    this.innerMenuList = [];
  }

  @action
  appendMenu() {
    let order = 0;
    const last = this.innerMenuList
      .map((c) => c.order)
      .reduce((p, c) => {
        if (c > p) {
          return c;
        }
        return p;
      }, order);
    order = last + 1;
    const next = { ...getEmptyMenu(), order, editing: true, isNew: true };
    this.innerMenuList.push(next);
    this.select(this.innerMenuList[this.innerMenuList.length - 1]);
    this.menuTransaction.appendIds.push(next.id);
  }

  @action
  appendSubMenu() {
    if (this.innerMenuList.length === 0) {
      return;
    }
    const list = this.innerMenuList.sort((a, b) => a.order - b.order);
    const parentId = this.innerHasSelected
      ? this.innerSelected.parentId || this.innerSelected.id
      : list[list.length - 1].parentId || list[this.innerMenuList.length - 1].id;
    let order = 0;
    const last = list
      .filter((c) => c.parentId === parentId)
      .map((c) => c.order)
      .reduce((p, c) => {
        if (c > p) {
          return c;
        }
        return p;
      }, order);
    order = last + 1;

    const next = {
      ...getEmptyMenu(),
      parentId,
      order,
      editing: true,
      isNew: true,
    };
    this.innerMenuList.push(next);
    this.select(this.innerMenuList[this.innerMenuList.length - 1]);
    this.menuTransaction.appendIds.push(next.id);
  }

  @action
  removeMenu(id: string) {
    const item = this.innerMenuList.find((c) => c.id === id);
    if (item === undefined) {
      return;
    }
    if (this.menuTransaction.appendIds.includes(id)) {
      this.menuTransaction.appendIds = this.menuTransaction.appendIds.filter((c) => c !== id);
    } else {
      this.menuTransaction.removeds.push(id);
    }
    (this.innerMenuList as unknown as ObservableArray<MenuViewModel>).remove(item);
  }

  @action
  upMenu() {
    const menu = this.innerSelected;
    if (menu.editing === true) {
      return;
    }
    let list = this.innerMenuList
      .filter((c) => c.parentId === undefined && c.order < menu.order)
      .sort((a, b) => a.order - b.order);
    if (menu.parentId !== undefined) {
      list = this.innerMenuList
        .filter((c) => c.parentId === menu.parentId && c.order < menu.order)
        .sort((a, b) => a.order - b.order);
    }

    if (list.length === 0 && menu.parentId !== undefined) {
      // return;
      const parentList = this.innerMenuList.filter((c) => c.parentId === undefined).sort((a, b) => a.order - b.order);

      const index = parentList.findIndex((f) => f.id === menu.parentId) - 1;

      if (index === -1) {
        return;
      }

      const subList = this.innerMenuList
        .filter((c) => c.parentId === parentList[index].id)
        .sort((a, b) => a.order - b.order);

      menu.parentId = parentList[index].id;
      menu.order = subList.length > 0 ? subList[subList.length - 1].order + 1 : 1;

      this.pushNameValue(menu.id, 'parentId', parentList[index].id);
      this.pushNameValue(menu.id, 'order', menu.order.toString());
    }

    if (list.length === 0) {
      return;
    }
    const next = list[list.length - 1];
    const nextOrder = next.order;
    next.order = menu.order;
    menu.order = nextOrder;
    this.pushNameValue(menu.id, 'order', menu.order.toString());
    this.pushNameValue(next.id, 'order', next.order.toString());
  }

  @action
  downMenu() {
    const menu = this.innerSelected;
    if (menu.editing === true) {
      return;
    }

    let list = this.innerMenuList
      .filter((c) => c.parentId === undefined && c.order > menu.order)
      .sort((a, b) => a.order - b.order);
    if (menu.parentId !== undefined) {
      list = this.innerMenuList
        .filter((c) => c.parentId === menu.parentId && c.order > menu.order)
        .sort((a, b) => a.order - b.order);
    }

    if (list.length === 0 && menu.parentId !== undefined) {
      // return;
      const parentList = this.innerMenuList.filter((c) => c.parentId === undefined).sort((a, b) => a.order - b.order);

      const index = parentList.findIndex((f) => f.id === menu.parentId) + 1;

      if (parentList.length === index) {
        return;
      }

      menu.parentId = parentList[index].id;
      menu.order = 1;
      this.pushNameValue(menu.id, 'parentId', parentList[index].id);

      list = this.innerMenuList
        .filter((c) => c.parentId === parentList[index].id)
        .sort((a, b) => a.order - b.order)
        .map((m) => {
          m.order++;
          this.pushNameValue(m.id, 'order', m.order.toString());
          return m;
        });
    }

    if (list.length === 0) {
      return;
    }
    const next = list[0];
    const nextOrder = next.order;
    next.order = menu.order;
    menu.order = nextOrder;
    this.pushNameValue(menu.id, 'order', menu.order.toString());
    this.pushNameValue(next.id, 'order', next.order.toString());
  }

  @computed
  get menuList() {
    return this.innerMenuList;
  }

  @observable
  innerSelected: MenuViewModel = getEmptyMenu();

  @action
  select(next: MenuViewModel | null) {
    //
    if (this.innerSelected.editing) {
      if (this.innerSelected.name === undefined || this.innerSelected.name === null || this.innerSelected.name === '') {
        return;
      }
      this.innerSelected.editing = false;
    }
    // this.innerSelected = {
    //   id: Date.now().toString(),
    //   menuId: '',
    //   editing: false,
    //   order: 0,
    //   type: 'BASIC',
    //   accessType: 'COMMUNITY_ALL_MEMBER',
    //   name: '',
    //   url: '',
    //   html: '',
    //   groupId: '',
    //   discussionTopic: '',
    //   surveyId: '',
    //   surveyInformation: '',
    // };

    if (next === undefined || next === null) {
      this.innerHasSelected = false;
      this.innerSelected = { ...getEmptyMenu(), id: '' };
      return;
    }
    this.innerHasSelected = true;
    this.innerSelected = next;
  }

  @action
  changeName(next: string) {
    this.innerSelected.name = next;
    this.pushNameValue(this.innerSelected.id, 'name', next);
  }

  @action
  changeSurveyInformation(next: string) {
    this.innerSelected.surveyInformation = next;
    this.pushNameValue(this.innerSelected.id, 'surveyInformation', next);
  }

  @action
  getInnerSelected() {
    return this.innerSelected;
  }

  @action
  changeType(next: MenuType) {
    this.innerSelected.type = next;
    this.pushNameValue(this.innerSelected.id, 'type', next);
  }

  @action
  changeAccessType(next: AccessType) {
    this.innerSelected.accessType = next;
    this.pushNameValue(this.innerSelected.id, 'accessType', next);
  }

  @action
  changeGroupId(next: string) {
    this.innerSelected.groupId = next;
    this.pushNameValue(this.innerSelected.id, 'groupId', next);
  }

  @action
  changeUrl(next: string) {
    this.innerSelected.url = next;
    this.pushNameValue(this.innerSelected.id, 'url', next);
  }

  @action
  changeHtml(next: string) {
    this.innerSelected.html = next;
    this.pushNameValue(this.innerSelected.id, 'html', next);
  }

  @action
  changeDiscussionTopic(next: string) {
    this.innerSelected.discussionTopic = next;
    this.pushNameValue(this.innerSelected.id, 'discussionTopic', next);
  }

  @action
  changeDiscussionContent(next: string) {
    this.innerSelected.content = next;
    this.pushNameValue(this.innerSelected.id, 'content', next);
  }

  @action
  changeDiscussionFileBoxId(next: string) {
    this.innerSelected.fileBoxId = next;
    this.pushNameValue(this.innerSelected.id, 'fileBoxId', next);
  }

  @action
  setDiscussionRelatedUrlList(e: RelatedUrl[]) {
    this.innerSelected.relatedUrlList = e;
    //this.pushNameValue(this.innerSelected.id, 'relatedUrlList', JSON.stringify(e));
  }

  @action
  minusDiscussionRelatedUrlList(e: RelatedUrl[]) {
    this.innerSelected.relatedUrlList = e;
    this.pushNameValue(this.innerSelected.id, 'relatedUrlList', JSON.stringify(e));
  }

  @action
  changeDiscussionPrivateComment(next: boolean) {
    this.innerSelected.privateComment = next;
    this.pushNameValue(this.innerSelected.id, 'privateComment', next ? 'true' : 'false');
  }

  @action
  changeDiscussionRelatedUrlList(gbn: string, i: any, e: any) {
    const relatedUrlListTemp = this.innerSelected.relatedUrlList;
    if (relatedUrlListTemp !== undefined) {
      relatedUrlListTemp.map((m, index) => {
        if (e !== null) {
          if (i === index) {
            if (gbn === 'title') {
              m.title = e;
            } else {
              m.url = e;
            }
          }
        }
        return m;
      });

      this.innerSelected.relatedUrlList = relatedUrlListTemp;
      this.pushNameValue(this.innerSelected.id, 'relatedUrlList', JSON.stringify(relatedUrlListTemp));
    }
  }

  @action
  setSurveyId(next: string) {
    this.innerSelected.surveyId = next;
    this.pushNameValue(this.innerSelected.id, 'surveyId', next);
  }

  @action
  stopEditing() {
    this.innerSelected.editing = false;
  }

  @action
  changeDiscussionTitle(next: string) {
    this.innerSelected.relatedUrlList = [{ title: next, url: '' }];
    this.pushNameValue(this.innerSelected.id, 'relatedUrlList', next);
  }

  @action
  changeDiscussionUrl(next: string) {
    this.innerSelected.relatedUrlList = [{ title: '', url: next }];
    this.pushNameValue(this.innerSelected.id, 'relatedUrlList', next);
  }

  @computed
  get selected() {
    return this.innerSelected;
  }

  @observable
  menuSurvey: MenuSurveyCdo = getEmptyMenuSurveyCdo();

  @action
  setSurveyTitle(next: string) {
    this.menuSurvey.title = next;
    // this.pushNameValue(this.menuSurvey.id, 'title', next);
  }

  @action
  setSurveyCreatorName(next: string) {
    this.menuSurvey.creatorName = next;
    // this.pushNameValue(this.menuSurvey.id, 'creatorName', next);
  }

  @computed
  get menuSurveySelected() {
    return this.menuSurvey;
  }

  @observable
  innerHasSelected: boolean = false;

  @action
  initSelected() {
    this.innerHasSelected = false;
  }

  @computed
  get hasSelected() {
    return this.innerHasSelected;
  }

  menuTransaction: MenuTransaction = getEmptyMenuTransaction();

  pushNameValue(id: string, name: string, value: string) {
    if (this.menuTransaction.appendIds.includes(id)) {
      return;
    }
    if (!this.menuTransaction.modifieds.has(id)) {
      const nameValueList = new NameValueList();
      nameValueList.nameValues.push({ name, value });
      this.menuTransaction.modifieds.set(id, nameValueList);
    } else {
      let existNameIndex = -1;
      this.menuTransaction.modifieds.get(id)?.nameValues.forEach((element, index) => {
        if (element.name === name) {
          existNameIndex = index;
        } else {
          existNameIndex = -1;
        }
      });
      if (existNameIndex > -1) {
        this.menuTransaction.modifieds.get(id)?.nameValues.splice(existNameIndex);
      }
      this.menuTransaction.modifieds.get(id)?.nameValues.push({ name, value });
    }
  }
}

MenuStore.instance = new MenuStore();

export default MenuStore;
