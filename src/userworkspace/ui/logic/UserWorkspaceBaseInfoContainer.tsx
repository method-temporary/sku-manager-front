import React, { ReactNode } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Button, Container } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

import { patronInfo } from '@nara.platform/dock';
import { MemberViewModel } from '@nara.drama/approval';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { UserGroupRuleModel, SelectTypeModel } from 'shared/model';
import { alert, AlertModel, confirm, ConfirmModel, SubActions, Loader } from 'shared/components';
import { AccessRuleService } from 'shared/present';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';
import { LoaderService } from 'shared/components/Loader';
import { yesNoToBoolean } from 'shared/helper';

import { MemberService } from '../../../approval';
import { userManagementUrl } from '../../../Routes';
import { UserGroupService } from '../../../usergroup';
import { UserWorkspaceState } from '../../model/vo/UserWorkspaceState';
import UserWorkspaceService from '../../present/logic/UserWorkspaceService';
import UserWorkspaceModel from '../../model/UserWorkspaceModel';
import UserWorkspaceBaseInfoDetailView from '../view/UserWorkspaceBaseInfoDetailView';
import UserWorkspaceBaseInfoCreateView from '../view/UserWorkspaceBaseInfoCreateView';
import UserWorkspaceUserGroupView from '../view/UserWorkspaceUserGroupView';
import UserWorkspaceLearningInfoView from '../view/UserWorkspaceLearningInfoView';

interface Props extends RouteComponentProps<Params> {
  findUserWorkspaceById: (id: string) => void;
}

interface Params {
  userWorkspaceId: string;
  cineroomId: string;
}

interface States {
  updatable: boolean;
}

interface Injected {
  userWorkspaceService: UserWorkspaceService;
  memberService: MemberService;
  accessRuleService: AccessRuleService;
  userGroupService: UserGroupService;
  loaderService: LoaderService;
}

@inject('userWorkspaceService', 'memberService', 'accessRuleService', 'userGroupService', 'loaderService')
@observer
@reactAutobind
class UserWorkspaceBaseInfoContainer extends ReactComponent<Props, States, Injected> {
  //
  constructor(props: Props) {
    super(props);
    this.state = {
      updatable: false,
    };
  }

  componentDidMount() {
    //
    const { userGroupService } = this.injected;
    userGroupService.findUserGroupMap();
  }

  changeUpdatableMode(updatable: boolean) {
    //
    const { userWorkspaceId } = this.props.match.params;

    this.setState({ updatable });
    if (!updatable) {
      //
      this.props.findUserWorkspaceById(userWorkspaceId);
    }
  }

  routeToUserWorkspaceListPage() {
    //
    const rules = patronInfo.getPatronRoles(patronInfo.getCineroomId());
    if (rules.includes('SuperManager')) {
      this.props.history.push(
        `/cineroom/${this.props.match.params.cineroomId}/${userManagementUrl}/userWorkspace/userWorkspace-list`
      );
    } else {
      this.props.history.push(
        `/cineroom/${
          this.props.match.params.cineroomId
        }/${userManagementUrl}/userWorkspace/userWorkspace-detail/${patronInfo.getCineroomId()}`
      );
    }
  }

  getParentWorkspaceName(id: string): string {
    //
    const { userWorkspaceService } = this.injected;
    return userWorkspaceService.getParentWorkspaceName(id);
  }

  getParentWorkspaceOptions(): SelectTypeModel[] {
    //
    const { userWorkspaceService } = this.injected;
    const options: SelectTypeModel[] = [];

    options.push({ key: '0', text: '없음', value: '' });

    userWorkspaceService.parentUserWorkspaces.forEach((userWorkspace) => {
      options.push(new SelectTypeModel(userWorkspace.id, getPolyglotToAnyString(userWorkspace.name), userWorkspace.id));
    });

    return options;
  }

  handleManagerModalOk(member: MemberViewModel, propertyName: string) {
    const { userWorkspaceService } = this.injected;
    if (propertyName === 'apl') {
      userWorkspaceService.changeUserWorkspaceProps(
        'lectureApproval.aplApproverName',
        MemberViewModel.getLanguageStringByLanguage(member.names, 'ko')
      );
      userWorkspaceService.changeUserWorkspaceProps('lectureApproval.aplApprover', member.id);
    } else if (propertyName === 'paid') {
      userWorkspaceService.changeUserWorkspaceProps(
        'lectureApproval.courseApproverName',
        MemberViewModel.getLanguageStringByLanguage(member.names, 'ko')
      );
      userWorkspaceService.changeUserWorkspaceProps('lectureApproval.courseApprover', member.id);
    }
  }

  onChangeUserWorkspaceProps(name: string, value: any): void {
    const { userWorkspaceService } = this.injected;
    if (name === 'useApl') {
      userWorkspaceService.changeUserWorkspaceProps(name, yesNoToBoolean(value));
      return;
    }
    userWorkspaceService.changeUserWorkspaceProps(name, value);
  }

  async onSave() {
    //
    if (this.userWorkspaceValidationCheck()) {
      await this.modifyUserWorkspace();
    }
  }

  userWorkspaceValidationCheck(): boolean {
    //
    const { userWorkspaceService } = this.injected;
    const { userWorkspace } = userWorkspaceService;
    // validationCheck
    const { userWorkspaceId } = this.props.match.params;
    const isMySUNI = userWorkspaceId === 'ne1-m2-c2';
    const hasChildren = userWorkspaceService.parentUserWorkspaces.some((parent) => parent.id === userWorkspaceId);

    if (!isMySUNI && !hasChildren) {
      if (userWorkspace.defaultUserGroupSequences.sequences.length === 0) {
        alert(
          AlertModel.getCustomAlert(true, '사용자 소속 저장', '초기 사용자 그룹은 1개 이상 등록되어야 합니다.', '확인')
        );
        return false;
      }

      if (
        userWorkspace.blacklistAccessRuleForPaidLecture.groupSequences.length > 1 &&
        userWorkspace.blacklistAccessRuleForPaidLecture.groupSequences.some((sequence) => sequence === 1)
      ) {
        alert(
          AlertModel.getCustomAlert(
            true,
            '사용자 소속 저장',
            "유료과정 블랙리스트 규칙을 2개이상 설정할 때 '빈 블랙리스트 규칙용' 규칙을 같이 설정할 수 없습니다.",
            '확인'
          )
        );
        return false;
      }
    }

    return true;
  }

  async modifyUserWorkspace() {
    const { userWorkspaceService } = this.injected;
    const { userWorkspace } = userWorkspaceService;

    if (this.validationCheck(userWorkspace)) {
      confirm(
        ConfirmModel.getSaveConfirm(async () => {
          await userWorkspaceService.modifyUserWorkspace(
            userWorkspace.id,
            UserWorkspaceModel.asNameValues(userWorkspace)
          );

          alert(AlertModel.getCustomAlert(true, '사용자 소속 저장', '저장되었습니다.', '확인'));
          this.routeToUserWorkspaceListPage();
        })
      );
    }
  }

  validationCheck(userWorkspace: UserWorkspaceModel): boolean {
    //
    let validation = '';
    if (getPolyglotToAnyString(userWorkspace.name) === null || getPolyglotToAnyString(userWorkspace.name) === '') {
      validation = '이름을 입력해 주세요.';
    }
    if (!userWorkspace.usid) {
      validation = 'USID를 입력해 주세요.';
    }
    if (userWorkspace.state === UserWorkspaceState.DEFAULT) {
      validation = '사용여부를 선택해 주세요.';
    }
    if (validation !== '') {
      alert(AlertModel.getCustomAlert(true, '사용자 소속 관리', validation, '확인'));
      return false;
    }

    return true;
  }

  makeUserGroupsNode(groupSequences: number[]) {
    //
    const { userGroupService } = this.injected;
    const { userGroupMap } = userGroupService;

    // console.log(groupSequences);
    const groupNodeString: ReactNode[] = groupSequences.map((groupSequence: number, idx) => {
      const userGroup = userGroupMap.get(groupSequence);
      const categoryName = userGroup?.categoryName;
      const groupName = userGroup?.userGroupName;
      return (
        <Button
          key={idx}
          className="del no-clickable"
          style={{ padding: '0 1.125rem', margin: '0.2rem', fontWeight: 400 }}
        >
          {categoryName} {' > '} {groupName}
        </Button>
      );
    });

    return <>{groupNodeString}</>;
  }

  initialModifyAccessRuleValue(sequences: number[]): void {
    //
    const { accessRuleService, userGroupService } = this.injected;
    const accessRole: UserGroupRuleModel[] = [];
    const { userGroupMap } = userGroupService;

    sequences.forEach((sequence: number) => {
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
    accessRuleService.setAccessRules(accessRole);
  }

  onModifyAccessRule(name: string): void {
    //
    const { accessRuleService, userWorkspaceService } = this.injected;

    const sequences = accessRuleService.accessRules.map((accessRule) => accessRule.seq);
    userWorkspaceService.changeUserWorkspaceProps(name, sequences);
  }

  render() {
    //
    const { updatable } = this.state;
    const { userWorkspaceService } = this.injected;
    const { userWorkspace } = userWorkspaceService;
    const { userWorkspaceId } = this.props.match.params;
    const isMySUNI = userWorkspaceId === 'ne1-m2-c2';
    const hasChildren = userWorkspaceService.parentUserWorkspaces.some((parent) => parent.id === userWorkspaceId);
    const roles = patronInfo.getPatronRoles(patronInfo.getCineroomId());

    return (
      <Container fluid>
        {userWorkspaceId ? (
          <>
            <Loader name="info">
              <UserWorkspaceBaseInfoDetailView
                getParentWorkspaceName={this.getParentWorkspaceName}
                handleManagerModalOk={this.handleManagerModalOk}
                onChangeUserWorkspaceProps={this.onChangeUserWorkspaceProps}
                userWorkspace={userWorkspace}
                updatable={updatable}
                parentWorkspaceOptions={this.getParentWorkspaceOptions()}
              />
            </Loader>
            {!isMySUNI && !hasChildren ? (
              <>
                <Loader name="info">
                  <UserWorkspaceUserGroupView
                    makeUserGroupsNode={this.makeUserGroupsNode}
                    initialModifyAccessRuleValue={this.initialModifyAccessRuleValue}
                    onModifyAccessRule={this.onModifyAccessRule}
                    userWorkspace={userWorkspace}
                    // accessRules={accessRules}
                    updatable={updatable}
                  />
                </Loader>
                <Loader name="learning">
                  <UserWorkspaceLearningInfoView
                    handleManagerModalOk={this.handleManagerModalOk}
                    onChangeUserWorkspaceProps={this.onChangeUserWorkspaceProps}
                    makeUserGroupsNode={this.makeUserGroupsNode}
                    initialModifyAccessRuleValue={this.initialModifyAccessRuleValue}
                    onModifyAccessRule={this.onModifyAccessRule}
                    userWorkspace={userWorkspace}
                    updatable={updatable}
                  />
                </Loader>
              </>
            ) : null}
          </>
        ) : (
          <UserWorkspaceBaseInfoCreateView
            getParentWorkspaceName={this.getParentWorkspaceName}
            userWorkspace={userWorkspace}
            updatable={updatable}
            parentWorkspaceOptions={this.getParentWorkspaceOptions()}
          />
        )}

        <SubActions form>
          <SubActions.Left>
            {userWorkspaceId ? (
              updatable ? (
                <Button onClick={() => this.changeUpdatableMode(false)}>취소</Button>
              ) : (
                <Button onClick={() => this.changeUpdatableMode(true)}>수정</Button>
              )
            ) : null}
          </SubActions.Left>
          <SubActions.Right>
            {roles.includes('SuperManager') ? (
              <Button basic onClick={() => this.routeToUserWorkspaceListPage()}>
                목록
              </Button>
            ) : null}
            <Button primary disabled={!updatable} onClick={() => this.onSave()}>
              저장
            </Button>
          </SubActions.Right>
        </SubActions>
      </Container>
    );
  }
}

export default withRouter(UserWorkspaceBaseInfoContainer);
