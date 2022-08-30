import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Button, Container, Icon } from 'semantic-ui-react';
import moment from 'moment';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectType } from 'shared/model';
import { SharedService } from 'shared/present';
import {
  PageTitle,
  SubActions,
  Pagination,
  SearchBox,
  Loader,
  alert,
  confirm,
  AlertModel,
  ConfirmModel,
} from 'shared/components';
import { addSelectTypeBoxAllOption } from 'shared/helper';
import { LoaderService } from 'shared/components/Loader';

import { UserWorkspaceService } from 'userworkspace';
import { UserGroupCategoryService } from '../../../index';
import { UserGroupCategoryModel, UserGroupCategoryQueryModel } from '../../model';
import UserGroupCategoryListView from '../view/UserGroupCategoryListView';

interface Props extends RouteComponentProps<Params> {}

interface Params {
  cineroomId: string;
}

interface States {
  startDate: Date;
  endDate: Date;
  cineroomId: string;
  searchWord: string;
  checked: boolean;
}

interface Injected {
  userGroupCategoryService: UserGroupCategoryService;
  sharedService: SharedService;
  loaderService: LoaderService;
  userWorkspaceService: UserWorkspaceService;
}

@inject('userGroupCategoryService', 'sharedService', 'loaderService', 'userWorkspaceService')
@observer
@reactAutobind
class UserGroupCategoryContainer extends ReactComponent<Props, States, Injected> {
  //
  paginationKey = 'userGroupCategory';

  constructor(props: Props) {
    //
    super(props);
    this.state = {
      startDate: moment().toDate(),
      endDate: moment().toDate(),
      cineroomId: '',
      searchWord: '',
      checked: false,
    };

    // this.injected.userWorkspaceService.findAllUserWorkspacesMap()
  }

  async findUserGroupCategoryList() {
    //
    const { sharedService, userGroupCategoryService } = this.injected;
    const pageModel = sharedService.getPageModel(this.paginationKey);

    this.setState({ checked: false });
    const totalCount = await userGroupCategoryService.findUserGroupCategories(pageModel);

    sharedService.setCount(this.paginationKey, totalCount);
  }

  onChangeSearchWord(event: any) {
    //
    this.setState({ searchWord: event.target.value });
  }

  onClickCheckAll(value: boolean) {
    //
    const { userGroupCategoryService } = this.injected;

    this.setState({ checked: value });

    userGroupCategoryService.userGroupCategoryList &&
      userGroupCategoryService.userGroupCategoryList.forEach((userGroupCategory, index) => {
        userGroupCategory.cineroomId === this.props.match.params.cineroomId &&
          userGroupCategory.userGroups.length === 0 &&
          userGroupCategoryService.changeUserGroupCategoryListProp(index, 'checked', value);
      });
  }

  onClickCheckOne(index: number, name: string, value: boolean, userGroupCategoryModel: UserGroupCategoryModel) {
    //
    const { userGroupCategoryService } = this.injected;

    if (userGroupCategoryModel.userGroups.length > 0) {
      alert(AlertModel.getCustomAlert(false, '삭제 안내', '사용자 그룹이 있는 분류는 삭제할 수 없습니다.', '확인'));
      return;
    }

    userGroupCategoryService.changeUserGroupCategoryListProp(index, name, value);

    // checkbox 선택시 ALL Checkbox 선택과 같으면 ALL Checkbox 체크 아니면 체크 해제
    if (
      userGroupCategoryService.userGroupCategoryList.filter(
        (userGroupCategory) =>
          userGroupCategory.cineroomId === this.props.match.params.cineroomId &&
          userGroupCategory.userGroups.length === 0
      ).length ===
      userGroupCategoryService.userGroupCategoryList.filter((userGroupCategory) => userGroupCategory.checked).length
    ) {
      this.setState({ checked: true });
    } else {
      this.setState({ checked: false });
    }
  }

  onClickMultiDelete() {
    //
    const { userGroupCategoryService } = this.injected;
    const checkedList = userGroupCategoryService.userGroupCategoryList.filter(
      (userGroupCategory) => userGroupCategory.checked
    );

    if (checkedList.length === 0) {
      alert(AlertModel.getRequiredChoiceAlert('사용자 그룹 분류'));
      return;
    }

    confirm(
      ConfirmModel.getRemoveConfirm(() => {
        userGroupCategoryService.removeUserGroupCategory(UserGroupCategoryQueryModel.asIdValues(checkedList));
        alert(AlertModel.getRemoveSuccessAlert(this.findUserGroupCategoryList));
      }),
      false
    );
  }

  routeToGroupCategoryCreate() {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/user-management/usergroup-category/user-group-category-create`
    );
  }

  routeToGroupCategoryDetail(userGroupCategoryId: string) {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/user-management/usergroup-category/user-group-category-detail/${userGroupCategoryId}`
    );
  }

  getUserSelect() {
    //
    return this.injected.userWorkspaceService.userWorkspaceSelect;
  }

  render() {
    //
    const { cineroomId } = this.props.match.params;
    const { sharedService, userGroupCategoryService } = this.injected;
    const { userGroupCategoryQuery, userGroupCategoryList, changeUserGroupCategoryQueryProp } =
      userGroupCategoryService;
    const { count, startNo } = sharedService.getPageModel(this.paginationKey);

    return (
      <Container fluid>
        <PageTitle breadcrumb={SelectType.userGroupCategory} />

        <SearchBox
          onSearch={this.findUserGroupCategoryList}
          queryModel={userGroupCategoryQuery}
          changeProps={changeUserGroupCategoryQueryProp}
          name={this.paginationKey}
        >
          <SearchBox.Group name="등록일자">
            <SearchBox.DatePicker
              startFieldName="period.startDateMoment"
              endFieldName="period.endDateMoment"
              searchButtons
            />
          </SearchBox.Group>

          <SearchBox.Group>
            {cineroomId === 'ne1-m2-c2' && (
              <SearchBox.Select
                name="사용처"
                fieldName="cineroomId"
                options={addSelectTypeBoxAllOption(this.getUserSelect())}
                placeholder="전체"
              />
            )}
            <SearchBox.Select name="사용여부" fieldName="searchEnabled" options={SelectType.useState} />
          </SearchBox.Group>

          <SearchBox.Group name="그룹 분류 명">
            <SearchBox.Input fieldName="searchWord" placeholder="그룹 분류 명을 입력해주세요." />
          </SearchBox.Group>
        </SearchBox>

        <Pagination name={this.paginationKey} onChange={this.findUserGroupCategoryList}>
          <SubActions>
            <SubActions.Left>
              <SubActions.Count number={count} text="개 등록" />
            </SubActions.Left>
            <SubActions.Right>
              <Pagination.SortFilter options={SelectType.sortFilterForUserGroup} />
              <Button primary type="button" onClick={this.onClickMultiDelete}>
                <Icon name="minus" />
                삭제
              </Button>
              <SubActions.CreateButton onClick={this.routeToGroupCategoryCreate}>생성</SubActions.CreateButton>
            </SubActions.Right>
          </SubActions>

          <Loader>
            <UserGroupCategoryListView
              checked={this.state.checked}
              cineroomId={cineroomId}
              userGroupCategoryList={userGroupCategoryList}
              routeToGroupCategoryDetail={this.routeToGroupCategoryDetail}
              startNo={startNo}
              onClickCheckAll={this.onClickCheckAll}
              onClickCheckOne={this.onClickCheckOne}
              userWorkspaceMap={this.injected.userWorkspaceService.userWorkspaceMap}
            />
          </Loader>

          <Pagination.Navigator />
        </Pagination>
      </Container>
    );
  }
}

export default withRouter(UserGroupCategoryContainer);
