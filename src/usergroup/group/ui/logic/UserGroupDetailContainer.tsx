import React from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Container, Header, Tab } from 'semantic-ui-react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectType } from 'shared/model';
import { SharedService } from 'shared/present';
import { PageTitle, SubActions, Loader, Polyglot } from 'shared/components';
import { LoaderService } from 'shared/components/Loader';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { UserWorkspaceService } from '../../../../userworkspace';
import { UserGroupService } from '../../../index';

import UserGroupDetailBasicInfoView from '../view/UserGroupDetailBasicInfoView';
import UserGroupDetailMemberListContainer from './UserGroupDetailMemberListContainer';

interface Props extends RouteComponentProps<Param> {}

interface Param {
  cineroomId: string;
  userGroupId: string;
}

interface State {
  activeIndex: number;
}

interface Injected {
  userGroupService: UserGroupService;
  sharedService: SharedService;
  userWorkspaceService: UserWorkspaceService;
  loaderService: LoaderService;
}

@inject('userGroupService', 'sharedService', 'userWorkspaceService', 'loaderService')
@observer
@reactAutobind
class UserGroupDetailContainer extends ReactComponent<Props, State, Injected> {
  //
  paginationKey = 'userGroupMember';

  state: State = {
    activeIndex: 0,
  };

  componentDidMount() {
    //
    this.init();
  }

  async init() {
    //
    const { userGroupService } = this.injected;
    await userGroupService.clearUserGroup();
    await this.findUserGroup();
  }

  async findUserGroup() {
    //
    const { userGroupService } = this.injected;

    userGroupService.clearUserGroup();
    await userGroupService.findUserGroupById(this.props.match.params.userGroupId);
  }

  routeToUserGroupList() {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/user-management/usergroup/user-group-list`
    );
  }

  routeToUserGroupModify(userGroupId: string) {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/user-management/usergroup/user-group-modify/${userGroupId}`
    );
  }

  getOpenedPanes() {
    //
    const { userGroupService, userWorkspaceService } = this.injected;
    const userGroup = userGroupService.userGroup;

    return [
      {
        menuItem: '기본정보',
        render: () => (
          <Tab.Pane attached={false}>
            <Loader>
              <UserGroupDetailBasicInfoView
                userGroup={userGroup}
                userWorkspaceMap={userWorkspaceService.userWorkspaceMap}
              />
            </Loader>
          </Tab.Pane>
        ),
      },
      {
        menuItem: '그룹 멤버',
        render: () => <UserGroupDetailMemberListContainer cineroomId={this.props.match.params.cineroomId} />,
      },
    ];
  }

  onTabChange(e: any, data: any) {
    //
    this.setState({ activeIndex: data.activeIndex });
  }

  render() {
    //
    const { userGroup } = this.injected.userGroupService;

    return (
      <Container fluid>
        <Polyglot languages={userGroup.langSupports}>
          <PageTitle breadcrumb={SelectType.userGroup}>사용자 그룹 관리</PageTitle>

          <Header as="h4">
            <span>사용자 그룹 - {getPolyglotToAnyString(userGroup.name)}</span>
          </Header>
          <Tab
            panes={this.getOpenedPanes()}
            menu={{ secondary: true, pointing: true }}
            className="styled-tab tab-wrap"
            onTabChange={(e: any, data: any) => this.onTabChange(e, data)}
          />
          <SubActions form>
            <SubActions.Left>
              {userGroup.cineroomId === this.props.match.params.cineroomId && this.state.activeIndex === 0 && (
                <Button onClick={() => this.routeToUserGroupModify(userGroup.id)} type="button">
                  수정
                </Button>
              )}
            </SubActions.Left>
            <SubActions.Right>
              <Button className="fl-right" basic onClick={this.routeToUserGroupList} type="button">
                목록
              </Button>
            </SubActions.Right>
          </SubActions>
        </Polyglot>
      </Container>
    );
  }
}

export default withRouter(UserGroupDetailContainer);
