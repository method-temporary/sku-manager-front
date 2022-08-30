import autobind from 'autobind-decorator';
import { action, observable, runInAction } from 'mobx';
import _ from 'lodash';

import { NameValueList, UserGroupRuleModel, AccessRule, OffsetElementList } from 'shared/model';

import ElementManagementApi from '_data/arrange/pageElements/api/ElementManagementApi';
import { PageElementRdo } from '_data/arrange/pageElements/model';

import { PageElementQueryModel } from '../../model/PageElementQueryModel';
import { PageElementModel } from '../..';

@autobind
export default class ElementManagementService {
  //
  static instance: ElementManagementService;

  elementManagementApi: ElementManagementApi;

  @observable
  pageElementQuery: PageElementQueryModel = new PageElementQueryModel();

  @observable
  pageElement: PageElementModel = new PageElementModel();

  @observable
  pageElements: PageElementModel[] = [];

  @observable
  accessRules: UserGroupRuleModel[] = [];

  constructor(elementManagementApi: ElementManagementApi) {
    this.elementManagementApi = elementManagementApi;
  }

  registerPageElement(pageElement: PageElementModel): Promise<string> {
    // pageElement 항목 생성 메소드
    return this.elementManagementApi.registerPageElement(pageElement);
  }

  @action
  async findAllPageElements(pageElementRdo: PageElementRdo): Promise<OffsetElementList<PageElementModel>> {
    // pageElement 전체 조회 메소드
    const offsetElementList = await this.elementManagementApi.findAllPageElements(pageElementRdo);
    runInAction(
      () => (this.pageElements = offsetElementList.results.map((pageElement) => new PageElementModel(pageElement)))
    );
    return offsetElementList;
  }

  @action
  async findPageElementById(id: string): Promise<PageElementModel> {
    // pageElement 단건 조회 메소드
    const pageElement = await this.elementManagementApi.findPageElementById(id);
    runInAction(() => (this.pageElement = pageElement));
    return pageElement;
  }

  @action
  changePageElementProps(name: string, value: any): void {
    // pageElement 내용 수정 메소드
    this.pageElement = _.set(this.pageElement, name, value);
  }

  @action
  changePageElementQueryProps(name: string, value: any): void {
    // pageElement 내용 수정 메소드
    this.pageElementQuery = _.set(this.pageElementQuery, name, value);
  }

  @action
  changePageElementListProps(name: string, index: number, value: AccessRule): void {
    // pageElement 내부 배열 요소 수정 메소드
    this.pageElement.groupBasedAccessRule.accessRules[index] = value;
  }

  @action
  setAccessRules(accessRules: UserGroupRuleModel[]): void {
    //
    this.accessRules = accessRules;
  }

  @action
  changeTargetPageElementProps(index: number, name: string, value: any): void {
    // 체크박스 이벤트 처리 함수
    this.pageElements = _.set(this.pageElements, `[${index}].${name}`, value);
  }

  modifyPageElement(pageElementId: string, nameValueList: NameValueList) {
    //
    this.elementManagementApi.updatePageElement(pageElementId, nameValueList);
  }

  @action
  removeAccessRule(targetRule: AccessRule): void {
    // pageElement에서 accessRule내용 삭제 메소드
    if (this.pageElement) {
      if (this.pageElement.groupBasedAccessRule.accessRules.indexOf(targetRule) >= 0) {
        this.pageElement.groupBasedAccessRule.accessRules.splice(
          this.pageElement.groupBasedAccessRule.accessRules.indexOf(targetRule),
          1
        );
      }
    }
  }

  removePageElements(ids: string[]): Promise<string> {
    // pageElement 목록에서 체크박스 선택된 항목 삭제

    return this.elementManagementApi.deletePageElementById(ids);
  }

  @action
  clearPageElements(): void {
    // pageElement 목록 초기화
    this.pageElements = [];
  }

  @action
  clearPageElement(): void {
    // pageElement 내용 초기화
    this.pageElement = new PageElementModel();
  }

  @action
  clearAccessRule(): void {
    // accessRule 내용 초기화
    this.accessRules = [];
  }
}

Object.defineProperty(ElementManagementService, 'instance', {
  value: new ElementManagementService(ElementManagementApi.instance),
  writable: false,
  configurable: false,
});
