import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { inject, observer } from 'mobx-react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { withRouter } from 'react-router-dom';
import { Button, Container } from 'semantic-ui-react';
import { alert, AlertModel, confirm, ConfirmModel, PageTitle, Pagination, SubActions } from 'shared/components';
import BadgeCategorySearchBoxView from '../view/BadgeCategorySearchBoxView';
import BadgeCategoryListView from '../view/BadgeCategoryListView';
import BadgeCategoryService from '../../present/logic/BadgeCategoryService';
import { SharedService } from 'shared/present';
import { BadgeCategoryQueryModel } from '../../model/BadgeCategoryQueryModel';
import { SelectType } from 'shared/model';
import UserWorkspaceService from '../../../../../userworkspace/present/logic/UserWorkspaceService';

interface Props extends RouteComponentProps<Params> {}

interface Params {
  cineroomId: string;
}

interface States {
  checked: boolean;
}

interface Injected {
  badgeCategoryService: BadgeCategoryService;
  sharedService: SharedService;
  userWorkspaceService: UserWorkspaceService;
}

@inject('badgeCategoryService', 'userWorkspaceService', 'sharedService')
@observer
@reactAutobind
class BadgeCategoryManagementListContainer extends ReactComponent<Props, States, Injected> {
  //
  paginationKey = 'badgeCategory';

  constructor(props: Props) {
    super(props);

    this.state = {
      checked: false,
    };
  }

  componentDidMount(): void {
    //
    this.clearBadgeCategories();
  }

  async findBadgeCategories() {
    //
    const { badgeCategoryService, sharedService } = this.injected;
    const { cineroomId } = this.props.match.params;

    let offsetElementList;

    if (cineroomId === 'ne1-m2-c2') {
      offsetElementList = await badgeCategoryService.findAllBadgeCategories(
        BadgeCategoryQueryModel.asBadgeCategoryRdo(
          badgeCategoryService.badgeCategoryQuery,
          sharedService.getPageModel(this.paginationKey)
        )
      );
    } else {
      //
      offsetElementList = await badgeCategoryService.findAllBadgeCategories(
        BadgeCategoryQueryModel.asBadgeCineroomCategoryRdo(cineroomId, sharedService.getPageModel(this.paginationKey))
      );
    }

    sharedService.setCount(this.paginationKey, offsetElementList.totalCount);
  }

  async removeBadgeCategories() {
    //
    this.removeConfirm();
  }

  removeConfirm() {
    //
    const checkedIsEmpty = this.checkedIsEmpty();

    if (checkedIsEmpty) {
      confirm(ConfirmModel.getRemoveConfirm(this.removeSuccessAlert), false);
    } else {
      alert(AlertModel.getCustomAlert(true, '필수입력선택 안내', 'Badge분류를 선택해 주세요', 'OK'));
    }
  }

  async removeSuccessAlert() {
    //
    const { badgeCategoryService } = this.injected;
    const removeResult = await badgeCategoryService.removeBadgeCategory(
      badgeCategoryService.badgeCategories
        .filter((badgeCategory) => badgeCategory.checked)
        .map((badgeCategory) => badgeCategory.id)
    );

    if (removeResult) {
      alert(AlertModel.getRemoveSuccessAlert());
    } else {
      alert(AlertModel.getCustomAlert(true, '삭제 실패 안내', '해당 Badge 분야는 사용중에 있습니다.', 'OK'));
    }
    this.onSelectAllCheckBox(false);
    this.findBadgeCategories();
  }

  changeBadgeCategoryQueryProps(name: string, value: any): void {
    //
    const { badgeCategoryService } = this.injected;
    badgeCategoryService.changeBadgeCategoryQueryProps(name, value);
  }

  clearBadgeCategories() {
    const { badgeCategoryService } = this.injected;

    badgeCategoryService.clearBadgeCategory();
    badgeCategoryService.clearBadgeCategories();
    badgeCategoryService.clearBadgeCategoryQueryProps();
  }

  checkedIsEmpty() {
    //
    const { badgeCategories } = this.injected.badgeCategoryService;
    const checked = badgeCategories.map((badgeCategory) => badgeCategory.checked);

    if (checked.includes(true)) {
      return true;
    }
    return false;
  }

  onSelectAllCheckBox(checked: boolean): void {
    //
    const { badgeCategoryService } = this.injected;

    this.setState({ checked });

    badgeCategoryService.badgeCategories.forEach((badgeCategory, index) => {
      badgeCategoryService.changeTargetBadgeCategoryProps(index, 'checked', checked);
    });
  }

  changeTargetBadgeCategoryProps(index: number, name: string, checked: boolean): void {
    //
    const { badgeCategoryService } = this.injected;
    const { badgeCategories } = badgeCategoryService;
    badgeCategoryService.changeTargetBadgeCategoryProps(index, name, checked);

    if (badgeCategories.filter((badgeCategory) => badgeCategory.checked).length === badgeCategories.length) {
      this.setState({ checked: true });
    } else {
      this.setState({ checked: false });
    }
  }

  routeToCreateBadgeCategory(): void {
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/certification-management/badgeCategory/badge-category-create`
    );
  }

  routeToDetailBadgeCategory(badgeCategoryId: string): void {
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/certification-management/badgeCategory/badge-category-create/${badgeCategoryId}`
    );
  }

  render() {
    //
    const { badgeCategories, badgeCategoryQuery } = this.injected.badgeCategoryService;
    const { userWorkspaceSelect, userWorkspaceMap } = this.injected.userWorkspaceService;
    const { count, startNo } = this.injected.sharedService.getPageModel(this.paginationKey);
    const { cineroomId } = this.props.match.params;
    const { checked } = this.state;

    return (
      <Container fluid>
        <PageTitle breadcrumb={SelectType.badgeCategorySections} />
        <BadgeCategorySearchBoxView
          onSearch={this.findBadgeCategories}
          changeBadgeCategoryQueryProps={this.changeBadgeCategoryQueryProps}
          badgeCategoryQuery={badgeCategoryQuery}
          paginationKey={this.paginationKey}
          userWorkspaceSelect={userWorkspaceSelect}
          cineroomId={cineroomId}
        />
        <SubActions>
          <SubActions.Left>
            <SubActions.Count number={count} text="개" />
          </SubActions.Left>
          <SubActions.Right>
            <Button primary onClick={this.removeBadgeCategories}>
              Delete
            </Button>
            <SubActions.CreateButton onClick={this.routeToCreateBadgeCategory}> Create </SubActions.CreateButton>
          </SubActions.Right>
        </SubActions>
        <Pagination name={this.paginationKey} onChange={this.findBadgeCategories}>
          <BadgeCategoryListView
            onSelectAllCheckBox={this.onSelectAllCheckBox}
            routeToDetailBadgeCategory={this.routeToDetailBadgeCategory}
            changeTargetBadgeCategoryProps={this.changeTargetBadgeCategoryProps}
            badgeCategories={badgeCategories}
            userWorkspaceMap={userWorkspaceMap}
            checked={checked}
            startNo={startNo}
          />
          <Pagination.Navigator />
        </Pagination>
      </Container>
    );
  }
}

export default withRouter(BadgeCategoryManagementListContainer);
