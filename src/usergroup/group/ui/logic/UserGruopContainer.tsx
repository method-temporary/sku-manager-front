import React from 'react';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SharedService } from 'shared/present';
import { SelectType } from 'shared/model';
import {
  PageTitle,
  SubActions,
  Pagination,
  alert,
  confirm,
  AlertModel,
  ConfirmModel,
  SearchBox,
  Loader,
} from 'shared/components';
import { LoaderService } from 'shared/components/Loader';
import { addSelectTypeBoxAllOption } from 'shared/helper';

import UserGroupService from '../../present/logic/UserGroupService';
import UserGroupListView from '../view/UserGruopListView';

import { UserGroupQueryModel } from '../../model';
import { UserGroupCategoryService } from '../../../index';
import { UserWorkspaceService } from '../../../../userworkspace';

interface Props extends RouteComponentProps<Params> {}

interface Params {
  cineroomId: string;
}

interface States {
  checked: boolean;
}

interface Injected {
  userGroupService: UserGroupService;
  userGroupCategoryService: UserGroupCategoryService;
  sharedService: SharedService;
  userWorkspaceService: UserWorkspaceService;
  loaderService: LoaderService;
}

@inject('userGroupService', 'sharedService', 'userWorkspaceService', 'userGroupCategoryService', 'loaderService')
@observer
@reactAutobind
class UserGroupContainer extends ReactComponent<Props, States, Injected> {
  //
  paginationKey = 'userGroup';

  constructor(props: Props) {
    //
    super(props);
    this.state = {
      checked: false,
    };

    this.injected.userGroupCategoryService.findUserGroupCategorySelectType();
  }

  async findUserGroupList() {
    //
    const { sharedService, userGroupService } = this.injected;
    const pageModal = sharedService.getPageModel(this.paginationKey);

    this.setState({ checked: false });
    const totalCount = await userGroupService.findUserGroups(pageModal);

    sharedService.setCount(this.paginationKey, totalCount);
  }

  routeToUserGroupCreate() {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/user-management/usergroup/user-group-create`
    );
  }

  routeToUserGroupDetail(userGroupId: string) {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/user-management/usergroup/user-group-detail/${userGroupId}`
    );
  }

  onClickSearch() {
    //
    this.findUserGroupList();
  }

  onClickCheckAll(value: boolean) {
    //
    const { userGroupService } = this.injected;

    this.setState({ checked: value });

    userGroupService.userGroupList.forEach((userGroup, index) => {
      userGroup.cineroomId === this.props.match.params.cineroomId &&
        userGroupService.changeUserGroupListProp(index, 'checked', value);
    });
  }

  onClickCheckOne(index: number, name: string, value: boolean) {
    //
    const { userGroupService } = this.injected;

    userGroupService.changeUserGroupListProp(index, name, value);

    // checkbox ????????? ALL Checkbox ????????? ????????? ALL Checkbox ?????? ????????? ?????? ??????
    if (
      userGroupService.userGroupList.filter((userGroup) => userGroup.cineroomId === this.props.match.params.cineroomId)
        .length === userGroupService.userGroupList.filter((userGroup) => userGroup.checked).length
    ) {
      this.setState({ checked: true });
    } else {
      this.setState({ checked: false });
    }
  }

  async onClickMultiEnabledOrDisabled(enabled: boolean) {
    //
    const { userGroupService } = this.injected;
    const checkedList = userGroupService.userGroupList.filter((userGroup) => userGroup.checked);

    if (checkedList.length === 0) {
      alert(AlertModel.getRequiredChoiceAlert('????????? ??????'));
      return;
    }

    if (enabled) {
      confirm(
        ConfirmModel.getCustomConfirm(`"??????"`, `?????? ?????????????????????????`, false, '??????', '??????', () => {
          userGroupService.enabledUserGroup(UserGroupQueryModel.asIdValues(checkedList));
          alert(AlertModel.getSaveSuccessAlert(this.resetPage));
        }),
        false
      );
    } else {
      confirm(
        ConfirmModel.getCustomConfirm(`"?????? ??????"`, `?????? ?????????????????????????`, false, '??????', '??????', () => {
          userGroupService.disabledUserGroup(UserGroupQueryModel.asIdValues(checkedList));
          alert(AlertModel.getSaveSuccessAlert(this.resetPage));
        }),
        false
      );
    }
  }

  resetPage() {
    //
    this.findUserGroupList();
  }

  getUserSelect() {
    //
    return this.injected.userWorkspaceService.userWorkspaceSelect;
  }

  render() {
    //
    const { cineroomId } = this.props.match.params;
    const { count, startNo } = this.injected.sharedService.getPageModel(this.paginationKey);
    const { userGroupQuery, changeUserGroupQueryProp } = this.injected.userGroupService;

    const userGroupCategory = this.injected.userGroupCategoryService.userGroupCategorySelectType;

    return (
      <Container fluid>
        <PageTitle breadcrumb={SelectType.userGroup} />

        <SearchBox
          onSearch={this.onClickSearch}
          queryModel={userGroupQuery}
          changeProps={changeUserGroupQueryProp}
          name={this.paginationKey}
        >
          <SearchBox.Group name="????????????">
            <SearchBox.DatePicker
              startFieldName="period.startDateMoment"
              endFieldName="period.endDateMoment"
              searchButtons
            />
          </SearchBox.Group>
          <SearchBox.Group name="????????? ?????? ??????">
            <SearchBox.Select
              fieldName="categoryId"
              options={addSelectTypeBoxAllOption(userGroupCategory)}
              placeholder="??????"
            />
            {cineroomId === 'ne1-m2-c2' && (
              <SearchBox.Select
                fieldName="cineroomId"
                options={addSelectTypeBoxAllOption(this.getUserSelect())}
                placeholder="??????"
                name="?????????"
              />
            )}
          </SearchBox.Group>
          <SearchBox.Group name="????????? ?????????">
            <SearchBox.Input placeholder="???????????? ??????????????????." fieldName="searchWord" />
          </SearchBox.Group>
        </SearchBox>

        <Pagination name={this.paginationKey} onChange={this.resetPage}>
          <SubActions>
            <SubActions.Left>
              <SubActions.Count number={count} text="??? ??????" />
            </SubActions.Left>
            <SubActions.Right>
              {/* // TODO 2021. 04. 14 ????????? ???????????? ????????? ?????? ????????? ?????? ????????????*/}
              {/*<Button primary type="button" onClick={() => this.onClickMultiEnabledOrDisabled(true)}>*/}
              {/*  <Icon name="plus square outline" />*/}
              {/*  ??????*/}
              {/*</Button>*/}
              {/*<Button primary type="button" onClick={() => this.onClickMultiEnabledOrDisabled(false)}>*/}
              {/*  <Icon name="minus square outline" />*/}
              {/*  ????????????*/}
              {/*</Button>*/}
              <Pagination.SortFilter options={SelectType.sortFilterForUserGroup} />
              <SubActions.CreateButton onClick={this.routeToUserGroupCreate}>??????</SubActions.CreateButton>
            </SubActions.Right>
          </SubActions>

          <Loader>
            <UserGroupListView
              checked={this.state.checked}
              cineroomId={this.props.match.params.cineroomId}
              userGroupList={this.injected.userGroupService.userGroupList}
              routeToUserGroupDetail={this.routeToUserGroupDetail}
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

export default withRouter(UserGroupContainer);
