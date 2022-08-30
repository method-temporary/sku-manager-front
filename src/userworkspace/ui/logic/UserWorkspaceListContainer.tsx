import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Button, Container } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectType, SelectTypeModel } from 'shared/model';
import { SharedService } from 'shared/present';
import { confirm, ConfirmModel, Loader, PageTitle, Pagination, SubActions } from 'shared/components';
import { LoaderService } from 'shared/components/Loader';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import UserWorkspaceSearchBox from '../view/UserWorkspaceSearchBox';
import UserWorkspaceListView from '../view/UserWorkspaceListView';
import UserWorkspaceService from '../../present/logic/UserWorkspaceService';
import UserWorkspaceQueryModel from '../../model/UserWorkspaceQueryModel';
import { userManagementUrl } from '../../../Routes';
import { UserGroupService } from '../../../usergroup';

interface Props extends RouteComponentProps<Params> {
  //
}

interface Params {
  userWorkspaceId: string;
  cineroomId: string;
}

interface States {}

interface Injected {
  userWorkspaceService: UserWorkspaceService;
  sharedService: SharedService;
  userGroupService: UserGroupService;
  loaderService: LoaderService;
}

@inject('userWorkspaceService', 'sharedService', 'userGroupService', 'loaderService')
@observer
@reactAutobind
class UserWorkspaceListContainer extends ReactComponent<Props, States, Injected> {
  //
  paginationKey = 'userWorkspaceList';

  componentDidMount() {
    //
    // const roles = patronInfo.getPatronRoles(patronInfo.getCineroomId());
    // if (!roles.includes('SuperManager')) {
    //   this.props.history.push('userWorkspace-detail/userWorkspaceId');
    // }
    this.init();
  }

  async init(): Promise<void> {
    const { userWorkspaceService, userGroupService, loaderService } = this.injected;

    loaderService.openLoader(true);

    await userGroupService.findUserGroupMap();
    await userWorkspaceService.findParentUserWorkspaces();
    userWorkspaceService.clearSelectedUserWorkspaceIds();

    loaderService.closeLoader(true);
  }

  async findUserWorkspaces(): Promise<void> {
    //
    const { userWorkspaceService, sharedService } = this.injected;
    const { userWorkspaceQueryModel } = userWorkspaceService;
    const pageModel = sharedService.getPageModel(this.paginationKey);

    userWorkspaceService.clearSelectedUserWorkspaceIds();

    const offsetList = await userWorkspaceService.findUserWorkspacesByRdo(
      UserWorkspaceQueryModel.asUserWorkspaceRdo(userWorkspaceQueryModel, pageModel)
    );

    sharedService.setCount(this.paginationKey, offsetList.totalCount);
  }

  changeUserWorkspaceQueryProps(name: string, value: any) {
    //
    const { userWorkspaceService } = this.injected;
    userWorkspaceService.changeUserWorkspaceQueryModelProps(name, value);
  }

  getHasParentOptions(): SelectTypeModel[] {
    //
    const { userWorkspaceService } = this.injected;
    const options: SelectTypeModel[] = [];

    options.push({ key: '0', text: '전체', value: 'All' }, { key: '1', text: '없음', value: 'none' });

    userWorkspaceService.parentUserWorkspaces.forEach((userWorkspace) => {
      options.push(new SelectTypeModel(userWorkspace.id, getPolyglotToAnyString(userWorkspace.name), userWorkspace.id));
    });

    return options;
  }

  getParentWorkspaceName(id: string): string {
    //
    const { userWorkspaceService } = this.injected;
    return userWorkspaceService.getParentWorkspaceName(id);
  }

  routeToUserWorkspaceDetailPage(id?: string) {
    //
    if (id) {
      this.props.history.push(
        `/cineroom/${this.props.match.params.cineroomId}/${userManagementUrl}/userWorkspace/userWorkspace-detail/${id}`
      );
    } else {
      this.props.history.push(
        `/cineroom/${this.props.match.params.cineroomId}/${userManagementUrl}/userWorkspace/userWorkspace-create`
      );
    }
  }

  onChecked(id: string): void {
    //
    const { userWorkspaceService } = this.injected;
    const { userWorkspaces } = userWorkspaceService;
    const selectedIds = [...userWorkspaceService.selectedUserWorkspaceIds];

    const allChecked =
      selectedIds.length !== 0 &&
      userWorkspaces.filter((userWorkspace) => !selectedIds.includes(userWorkspace.id)).length === 0;

    if (id === 'All') {
      if (!allChecked) {
        userWorkspaceService.setSelectedUserWorkspacesIds(
          userWorkspaceService.userWorkspaces.map((userWorkspace) => userWorkspace.id)
        );
      } else {
        userWorkspaceService.clearSelectedUserWorkspaceIds();
      }
    } else {
      if (selectedIds.includes(id)) {
        selectedIds.splice(
          selectedIds.findIndex((selectedId) => selectedId === id),
          1
        );
      } else {
        selectedIds.push(id);
      }

      userWorkspaceService.setSelectedUserWorkspacesIds(selectedIds);
    }
  }

  async onClickChangeUseStateButton(state: string): Promise<void> {
    //
    const { userWorkspaceService } = this.injected;
    if (state === 'Active') {
      confirm(
        ConfirmModel.getCustomConfirm('사용 처리', '사용 처리 하시겠습니까?', true, '확인', '취소', async () => {
          await userWorkspaceService.activeUserWorkspaces(userWorkspaceService.selectedUserWorkspaceIds);
          await this.findUserWorkspaces();
        })
      );
    } else if (state === 'Dormant') {
      confirm(
        ConfirmModel.getCustomConfirm(
          '사용중지 처리',
          '사용중지 처리 하시겠습니까?',
          true,
          '확인',
          '취소',
          async () => {
            await userWorkspaceService.dormantUserWorkspaces(userWorkspaceService.selectedUserWorkspaceIds);
            await this.findUserWorkspaces();
          }
        )
      );
    }
  }

  makeUserGroupsNode(groupSequences: number[]) {
    //
    const { userGroupService } = this.injected;
    const { userGroupMap } = userGroupService;

    const groupNodeString = groupSequences.map((groupSequence: number, idx) => {
      const userGroup = userGroupMap.get(groupSequence);
      const categoryName = userGroup?.categoryName;
      const groupName = userGroup?.userGroupName;
      return `${categoryName}-${groupName}${idx < groupSequences.length - 1 ? ', ' : ''}`;
    });

    return <>{groupNodeString}</>;
  }

  render() {
    //
    const { userWorkspaceService } = this.injected;
    const { userWorkspaceQueryModel, userWorkspaces, selectedUserWorkspaceIds } = userWorkspaceService;
    const { count, startNo } = this.injected.sharedService.getPageModel(this.paginationKey);

    return (
      <Container fluid>
        <PageTitle breadcrumb={SelectType.userWorkspace} />
        <Pagination name={this.paginationKey} onChange={this.findUserWorkspaces}>
          <UserWorkspaceSearchBox
            findUserWorkspaces={this.findUserWorkspaces}
            changeUserWorkspaceProps={this.changeUserWorkspaceQueryProps}
            userWorkspaceQuery={userWorkspaceQueryModel}
            hasParentOptions={this.getHasParentOptions()}
            name={this.paginationKey}
          />
          <SubActions>
            <SubActions.Left>
              <SubActions.Count number={count} text="개" />
            </SubActions.Left>
            <SubActions.Right>
              <Button onClick={() => this.onClickChangeUseStateButton('Active')}>사용</Button>
              <Button onClick={() => this.onClickChangeUseStateButton('Dormant')}>사용 중지</Button>
              {/*<SubActions.CreateButton onClick={() => this.routeToUserWorkspaceDetailPage()}>*/}
              {/*  생성*/}
              {/*</SubActions.CreateButton>*/}
            </SubActions.Right>
          </SubActions>

          <Loader>
            <UserWorkspaceListView
              routeToUserWorkspaceDetailPage={this.routeToUserWorkspaceDetailPage}
              getParentWorkspaceName={this.getParentWorkspaceName}
              onChecked={this.onChecked}
              makeUserGroupsNode={this.makeUserGroupsNode}
              userWorkspaces={userWorkspaces}
              selectedUserWorkspaceIds={selectedUserWorkspaceIds}
              startNo={startNo}
            />
          </Loader>
          <Pagination.Navigator />
        </Pagination>
      </Container>
    );
  }
}

export default withRouter(UserWorkspaceListContainer);
