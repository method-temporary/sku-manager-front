import React from 'react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { inject, observer } from 'mobx-react';
import { withRouter, RouteComponentProps } from 'react-router';

import { Container } from 'semantic-ui-react';
import { SelectType, UserGroupRuleModel, GroupBasedAccessRule } from 'shared/model';
import { SharedService, AccessRuleService } from 'shared/present';
import { confirm, ConfirmModel, PageTitle, Pagination, alert, AlertModel } from 'shared/components';
import { SearchBoxService } from 'shared/components/SearchBox';

import { displayManagementUrl } from '../../../Routes';
import { ElementManagementService } from '../../index';
import ElementManagementButtonView from '../view/ElementManagementButtonView';
import ElementManagementSearchView from '../view/ElementManagementSearchView';
import ElementManagementListView from '../view/ElementManagementListView';
import { PageElementQueryModel } from '../../model/PageElementQueryModel';
import { UserGroupService } from '../../../usergroup';

interface Props extends RouteComponentProps<Params> {}

interface Params {
  cineroomId: string;
}

interface Injected {
  sharedService: SharedService;
  elementManagementService: ElementManagementService;
  accessRuleService: AccessRuleService;
  searchBoxService: SearchBoxService;
  userGroupService: UserGroupService;
}

@inject('sharedService', 'elementManagementService', 'accessRuleService', 'searchBoxService', 'userGroupService')
@observer
@reactAutobind
class ElementManagementListContainer extends ReactComponent<Props, {}, Injected> {
  //
  paginationKey = 'page-element';

  async componentDidMount() {
    // 컴포넌트 마운트시 목록 조회
    // this.findAllPageElements();
    this.init();
  }

  async init(): Promise<void> {
    await this.injected.userGroupService.findUserGroupMap();
  }

  async findAllPageElements() {
    const { elementManagementService, sharedService } = this.injected;
    elementManagementService.clearPageElements();

    const pageModel = sharedService.getPageModel(this.paginationKey);
    elementManagementService.changePageElementQueryProps('limit', pageModel.limit);
    elementManagementService.changePageElementQueryProps('offset', pageModel.offset);

    const offsetElementList = await elementManagementService.findAllPageElements(
      PageElementQueryModel.asPageElementRdo(elementManagementService.pageElementQuery)
    );
    sharedService.setCount(this.paginationKey, offsetElementList.totalCount);
  }

  onChangePageElementCheckBox(index: number, name: string, value: string): void {
    // 체크박스 이벤트 처리 함수
    const { elementManagementService } = this.injected;

    elementManagementService.changeTargetPageElementProps(index, name, value);
  }

  onChangePageElementQueryProps(name: string, value: string | {} | []): void {
    // searchBox 에대한 내용(구분) 처리 함수
    const { elementManagementService } = this.injected;

    elementManagementService.changePageElementQueryProps(name, value);
  }

  routeToUpdatePageElement(pageElementId: string): void {
    // 항목 상세페이지로 이동 id를 들고감
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${displayManagementUrl}/pageElement/pageElement-create/${pageElementId}`
    );
  }

  async removeSuccessAlert() {
    //
    const { elementManagementService } = this.injected;
    await elementManagementService.removePageElements(
      elementManagementService.pageElements
        .filter((pageElement) => pageElement.checked)
        .map((pageElement) => pageElement.id)
    );
    alert(AlertModel.getRemoveSuccessAlert());
    elementManagementService.clearPageElements();
    await this.findAllPageElements();
  }

  async removePageElements() {
    // 체크박스에 체크된 항목들 삭제하는 함수
    const { elementManagementService } = this.injected;
    if (elementManagementService.pageElements.filter((pageElement) => pageElement.checked).length <= 0) {
      alert(AlertModel.getCustomAlert(false, ' ', '선택된 화면요소가 없습니다.', '확인', () => {}));
      return;
    }

    confirm(ConfirmModel.getRemoveConfirm(this.removeSuccessAlert), false);
  }

  onChangeCheckBox(value: boolean) {
    // TableHeader의 CheckBox를 처리하는 함수
    const { elementManagementService } = this.injected;

    elementManagementService.pageElements.forEach((pageElement, idx) => {
      elementManagementService.changeTargetPageElementProps(idx, 'checked', value);
    });
  }

  routeToCreateElement() {
    // 새로운 PageElement 항목 생성 페이지로 이동
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${displayManagementUrl}/pageElement/pageElement-create/`
    );
  }

  onSaveAccessRule(accessRoles: UserGroupRuleModel[]): void {
    //
    const { accessRuleService, searchBoxService } = this.injected;
    const accessRuleList = accessRoles.map((accessRole) => accessRole.seq);
    const ruleStrings = GroupBasedAccessRule.getRuleValueString(accessRoles);

    accessRuleService.clearGroupBasedAccessRule();
    accessRuleService.changeGroupBasedAccessRuleProp(
      `groupAccessRoles[${accessRuleService.groupBasedAccessRule.accessRules.length}].accessRoles`,
      accessRuleService.accessRules
    );

    searchBoxService.changePropsFn('groupBasedAccessRule', accessRuleList);
    searchBoxService.changePropsFn('ruleStrings', ruleStrings);
  }

  clearGroupBasedAccessRule(): void {
    //
    const { accessRuleService, searchBoxService } = this.injected;

    accessRuleService.clearGroupBasedAccessRule();
    searchBoxService.changePropsFn('groupBasedAccessRule', []);
    searchBoxService.changePropsFn('ruleStrings', '');
  }

  render() {
    //
    const { elementManagementService, accessRuleService, sharedService, userGroupService } = this.injected;
    const { pageElements, pageElementQuery } = elementManagementService;
    const { groupBasedAccessRule } = accessRuleService;
    const { startNo } = sharedService.getPageModel(this.paginationKey);

    return (
      <Container fluid>
        <PageTitle breadcrumb={SelectType.pageElementManagement} />
        <ElementManagementSearchView
          onClickSearchButton={this.findAllPageElements}
          onChangePageElementQueryProps={this.onChangePageElementQueryProps}
          onSaveAccessRule={this.onSaveAccessRule}
          clearGroupBasedAccessRule={this.clearGroupBasedAccessRule}
          pageElementQuery={pageElementQuery}
          groupBasedAccessRole={groupBasedAccessRule}
          paginationKey={this.paginationKey}
        />
        <ElementManagementButtonView index={pageElements.length} />

        <Pagination name={this.paginationKey} onChange={this.findAllPageElements}>
          <ElementManagementListView
            pageElements={pageElements}
            routeToUpdatePageElement={this.routeToUpdatePageElement}
            startNo={startNo}
            userGroupMap={userGroupService.userGroupMap}
          />

          <Pagination.Navigator />
        </Pagination>
      </Container>
    );
  }
}

export default withRouter(ElementManagementListContainer);
