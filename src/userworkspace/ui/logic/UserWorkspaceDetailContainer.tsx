import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Container, Tab } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectType, UserGroupRuleModel } from 'shared/model';
import { PageTitle } from 'shared/components';
import { AccessRuleService } from 'shared/present';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';
import { LoaderService } from 'shared/components/Loader';

import UserWorkspaceBaseInfoContainer from './UserWorkspaceBaseInfoContainer';
import UserWorkspaceAccountListContainer from './UserWorkspaceAccountListContainer';
import UserWorkspaceService from '../../present/logic/UserWorkspaceService';
import { MemberService } from '../../../approval';
import { UserGroupService } from '../../../usergroup';
import UserWorkspaceAdminListContainer from './UserWorkspaceAdminListContainer';

interface Props extends RouteComponentProps<Params> {}

interface Params {
  userWorkspaceId: string;
}

interface States {}

interface Injected {
  userWorkspaceService: UserWorkspaceService;
  memberService: MemberService;
  userGroupService: UserGroupService;
  accessRuleService: AccessRuleService;
  loaderService: LoaderService;
}

@inject('userWorkspaceService', 'memberService', 'userGroupService', 'accessRuleService', 'loaderService')
@observer
@reactAutobind
class UserWorkspaceDetailContainer extends ReactComponent<Props, States, Injected> {
  //
  componentDidMount() {
    //
    const { userWorkspaceId } = this.props.match.params;

    this.init();
    if (userWorkspaceId) {
      //
      this.findUserWorkspaceById(userWorkspaceId);
    } else {
      this.setState({ updatable: true });
    }
  }

  async init(): Promise<void> {
    const { userWorkspaceService, loaderService } = this.injected;

    loaderService.openLoader(true);
    await userWorkspaceService.findParentUserWorkspaces();
  }

  async findUserWorkspaceById(id: string) {
    //
    const { userWorkspaceService, loaderService } = this.injected;

    await userWorkspaceService.findUserWorkspaceById(id);

    if (userWorkspaceService.userWorkspace.registrant) {
      await this.setMemberNameById('creatorName', userWorkspaceService.userWorkspace.registrant);
    }

    loaderService.closeLoader(true, 'info');

    if (userWorkspaceService.userWorkspace.lectureApproval.courseApprover) {
      await this.setMemberNameById(
        'lectureApproval.courseApproverName',
        userWorkspaceService.userWorkspace.lectureApproval.courseApprover
      );
    }

    if (userWorkspaceService.userWorkspace.lectureApproval.aplApprover) {
      await this.setMemberNameById(
        'lectureApproval.aplApproverName',
        userWorkspaceService.userWorkspace.lectureApproval.aplApprover
      );
    }

    loaderService.closeLoader(true, 'learning');

    // await this.setAccessRules();
  }

  async setAccessRules(): Promise<void> {
    //
    const { userWorkspaceService, userGroupService, accessRuleService } = this.injected;
    const { userWorkspace } = userWorkspaceService;

    await userGroupService.findUserGroupMap();
    const accessRole: UserGroupRuleModel[] = [];
    const { userGroupMap } = userGroupService;

    userWorkspace.defaultUserGroupSequences &&
      userWorkspace.defaultUserGroupSequences.sequences &&
      userWorkspace.defaultUserGroupSequences.sequences.forEach((sequence: number) => {
        const userGroup = userGroupMap.get(sequence);
        accessRole.push(
          new UserGroupRuleModel(
            userGroup?.categoryId,
            userGroup?.categoryName,
            userGroup?.userGroupId,
            userGroup?.userGroupName,
            userGroup?.seq
          )
        );
      });
    await accessRuleService.setAccessRules(accessRole);
  }

  async setMemberNameById(name: string, keyString: string): Promise<void> {
    //
    const { memberService, userWorkspaceService } = this.injected;
    if (keyString) {
      const member = await memberService.findMemberById(keyString);
      userWorkspaceService.changeUserWorkspaceProps(name, getPolyglotToAnyString(member.name));
    }
  }

  getPanes() {
    //
    const { userWorkspaceService } = this.injected;
    const { userWorkspace } = userWorkspaceService;

    const menuItem = [
      {
        menuItem: '기본 정보',
        render: () => (
          <Tab.Pane attached={false}>
            <UserWorkspaceBaseInfoContainer findUserWorkspaceById={this.findUserWorkspaceById} />
          </Tab.Pane>
        ),
      },
    ];

    if (this.props.match.params.userWorkspaceId) {
      //
      if (!userWorkspace.hasChildren && !userWorkspace.syncWithGdi && userWorkspace.id !== 'ne1-m2-c2') {
        menuItem.push({
          menuItem: '사용자 계정',
          render: () => (
            <Tab.Pane attached={false}>
              <UserWorkspaceAccountListContainer />
            </Tab.Pane>
          ),
        });
      }

      menuItem.push({
        menuItem: '관리자',
        render: () => (
          <Tab.Pane attached={false}>
            <UserWorkspaceAdminListContainer />
          </Tab.Pane>
        ),
      });
    }

    return menuItem;
  }

  render() {
    //
    const { userWorkspaceService } = this.injected;
    const { userWorkspace } = userWorkspaceService;

    const { userWorkspaceId } = this.props.match.params;

    return (
      <Container fluid>
        <PageTitle breadcrumb={SelectType.userWorkspace}>
          사용자 소속 관리 {userWorkspaceId ? `- ${getPolyglotToAnyString(userWorkspace.name)}` : ''}
        </PageTitle>
        <Tab
          panes={this.getPanes()}
          menu={{ secondary: true, pointing: true }}
          className="styled-tab tab-wrap"
          onTabChange={() => this.injected.loaderService.closeLoader(true, 'ALL')}
        />
      </Container>
    );
  }
}

export default withRouter(UserWorkspaceDetailContainer);
