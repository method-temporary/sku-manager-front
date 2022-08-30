import Menu, { MenuViewModel } from '../model/Menu';
import { useState, useEffect, useCallback, ChangeEvent } from 'react';
import MenuStore from '../mobx/MenuStore';
import { autorun } from 'mobx';
import MenuType from '../model/MenuType';
import AccessType from '../model/AccessType';
import { InputOnChangeData } from 'semantic-ui-react';
import MenuSurveyCdo, {
  fromViewModelToSurveyCdo,
} from '../model/MenuSurveyCdo';
import SurveyFormApi from 'survey/form/present/apiclient/SurveyFormApi';
import RelatedUrl, { getEmptyRelatedUrl } from '../model/RelatedUrl';
import MenuDiscussionCdo, { getEmptyMenuDiscussionCdo } from 'community/menu/model/MenuDiscussionCdo';
import { findPostMenuDiscussion, findMenuDiscussionFeedBack } from '../api/MenuApi';



export interface Select {
  (next: string): void;
}

export interface ChangeName {
  (e: ChangeEvent<HTMLInputElement>): void;
}
export interface ChangeSurveyInformation {
  (e: ChangeEvent<HTMLInputElement>): void;
}
export interface ChangeType {
  (_: any, next: any): void;
}

export interface ChangeAccessTypeToCommunityAllMember {
  (): void;
}

export interface ChangeAccessTypeToCommunityGroup {
  (): void;
}

export interface ChangeGroupId {
  (_: any, next: any): void;
}

export interface ChangeUrl {
  (e: ChangeEvent<HTMLInputElement>): void;
}

export interface ChangeHtml {
  (next: string): void;
}

export interface ChangeDiscussionTopic {
  (e: ChangeEvent<HTMLInputElement>): void;
}

export interface StopEditing {
  (): void;
}

export interface GetInnerSelected {
  (): MenuViewModel;
}

export interface ChangeDiscussionTitle {
  (e: ChangeEvent<HTMLInputElement>): void;
}

export interface ChangeDiscussionUrl {
  (e: ChangeEvent<HTMLInputElement>): void;
}

//TODO 토론
export interface ChangeDiscussionFileBoxId {
  (next: string): void;
}

export interface ChangeDiscussionContent {
  (e: string): void;
}

export interface ChangeDiscussionRelatedUrlList {
  (gbn: string, i: any, next: string): void;
}

export interface SetDiscussionRelatedUrlList {
  (next: RelatedUrl[]): void;
}

export interface MinusDiscussionRelatedUrlList {
  (next: RelatedUrl[]): void;
}

export interface ChangeDiscussionPrivateComment {
  (next: boolean): void;
}

function select(id: string) {
  const next = MenuStore.instance.menuList.find((c) => c.id === id);
  if (next === undefined) {
    return;
  }
  MenuStore.instance.select(next);
}

function changeName(e: ChangeEvent<HTMLInputElement>) {
  MenuStore.instance.changeName(e.target.value);
}

function changeSurveyInformation(e: ChangeEvent<HTMLInputElement>) {
  MenuStore.instance.changeSurveyInformation(e.target.value);
}

function changeType(_: any, next: any) {
  MenuStore.instance.changeType(next.value);
}

function changeAccessTypeToCommunityAllMember() {
  MenuStore.instance.changeAccessType('COMMUNITY_ALL_MEMBER');
}

function changeAccessTypeToCommunityGroup() {
  MenuStore.instance.changeAccessType('COMMUNITY_GROUP');
}

function changeGroupId(_: any, next: any) {
  MenuStore.instance.changeGroupId(next.value);
}

function changeUrl(e: ChangeEvent<HTMLInputElement>) {
  MenuStore.instance.changeUrl(e.target.value);
}

function changeHtml(next: string) {
  MenuStore.instance.changeHtml(next);
}

function changeDiscussionTopic(e: ChangeEvent<HTMLInputElement>) {
  MenuStore.instance.changeDiscussionTopic(e.target.value);
}

function changeDiscussionTitle(e: ChangeEvent<HTMLInputElement>) {
  MenuStore.instance.changeDiscussionTitle(e.target.value);
}
function changeDiscussionContent(e: string) {
  MenuStore.instance.changeDiscussionContent(e);
}

function changeDiscussionFileBoxId(next: string) {
  MenuStore.instance.changeDiscussionFileBoxId(next);
}

function setDiscussionRelatedUrlList(e: RelatedUrl[]) {
  MenuStore.instance.setDiscussionRelatedUrlList(e);
}

function minusDiscussionRelatedUrlList(e: RelatedUrl[]) {
  MenuStore.instance.minusDiscussionRelatedUrlList(e);
}

function changeDiscussionRelatedUrlList(gbn: string, i: any, e: any) {
  MenuStore.instance.changeDiscussionRelatedUrlList(gbn, i, e);
}

function changeDiscussionPrivateComment(next: boolean) {
  MenuStore.instance.changeDiscussionPrivateComment(next);
}

function stopEditing() {
  if (
    MenuStore.instance.selected.name === undefined ||
    MenuStore.instance.selected.name === null ||
    MenuStore.instance.selected.name === ''
  ) {
    return;
  }
  MenuStore.instance.stopEditing();
}

function getInnerSelected() {
  return MenuStore.instance.getInnerSelected();
}

export function useSelectedMenu(): [
  MenuViewModel | undefined,
  Select,
  ChangeName,
  ChangeType,
  ChangeAccessTypeToCommunityAllMember,
  ChangeAccessTypeToCommunityGroup,
  ChangeGroupId,
  ChangeUrl,
  ChangeHtml,
  ChangeDiscussionTopic,
  ChangeSurveyInformation,
  StopEditing,
  GetInnerSelected,
  MenuSurveyCdo | undefined,
  ChangeDiscussionFileBoxId,
  ChangeDiscussionContent,
  ChangeDiscussionRelatedUrlList,
  SetDiscussionRelatedUrlList,
  ChangeDiscussionPrivateComment,
  MinusDiscussionRelatedUrlList,
  MenuDiscussionCdo | undefined,
] {
  const [value, setValue] = useState<MenuViewModel>();
  const [surveyCdo, setSurveyCdo] = useState<MenuSurveyCdo>();

  useEffect(() => {
    return autorun(() => {
      if (MenuStore.instance.hasSelected) {
        setValue({ ...MenuStore.instance.selected });
      } else {
        setValue(undefined);
      }
    });
  }, []);

  useEffect(() => {
    return autorun(() => {
      if (
        MenuStore.instance.hasSelected &&
        MenuStore.instance.innerSelected.type == 'SURVEY' &&
        MenuStore.instance.innerSelected.surveyId &&
        MenuStore.instance.innerSelected.surveyId !== ''
      ) {
        SurveyFormApi.instance
          .findSurveyForm(MenuStore.instance.innerSelected.surveyId)
          .then((survey) => {
            if (survey !== null) {
              setSurveyCdo(fromViewModelToSurveyCdo(survey));
            }
          });
      } else {
        setSurveyCdo(undefined);
      }
    });
  }, [value?.surveyId]);

  const [menuDiscussionCdo, setMenuDiscussionCdo] = useState<MenuDiscussionCdo>();
  useEffect(() => {
    return autorun(() => {
      if (
        MenuStore.instance.hasSelected &&
        MenuStore.instance.innerSelected.type == 'DISCUSSION' &&
        MenuStore.instance.innerSelected.menuId &&
        MenuStore.instance.innerSelected.menuId !== ''

        || MenuStore.instance.innerSelected.type == 'ANODISCUSSION' &&
        MenuStore.instance.innerSelected.menuId &&
        MenuStore.instance.innerSelected.menuId !== ''

      ) {
        findPostMenuDiscussion(MenuStore.instance.innerSelected.menuId)
          .then((datas) => {
            if (datas !== null) {
              //
              MenuStore.instance.innerSelected.content = datas?.content === undefined ? '' : datas?.content;
              MenuStore.instance.innerSelected.fileBoxId = datas?.fileBoxId === undefined ? '' : datas?.fileBoxId;
              if (datas?.relatedUrlList && datas?.relatedUrlList.length < 1 || datas?.relatedUrlList === undefined) {
                setDiscussionRelatedUrlList([getEmptyRelatedUrl()]);
              } else {
                setDiscussionRelatedUrlList(datas?.relatedUrlList === undefined || datas?.relatedUrlList === null ? [getEmptyRelatedUrl()] : datas?.relatedUrlList);
              }
              //
              setMenuDiscussionCdo(datas);

            }
          });
      } else {
        getEmptyMenuDiscussionCdo();
        setMenuDiscussionCdo(undefined);
      }
    });
  }, []);

  return [
    value,
    select,
    changeName,
    changeType,
    changeAccessTypeToCommunityAllMember,
    changeAccessTypeToCommunityGroup,
    changeGroupId,
    changeUrl,
    changeHtml,
    changeDiscussionTopic,
    changeSurveyInformation,
    stopEditing,
    getInnerSelected,
    surveyCdo,
    changeDiscussionFileBoxId,
    changeDiscussionContent,
    changeDiscussionRelatedUrlList,
    setDiscussionRelatedUrlList,
    changeDiscussionPrivateComment,
    minusDiscussionRelatedUrlList,
    menuDiscussionCdo
  ];
}
