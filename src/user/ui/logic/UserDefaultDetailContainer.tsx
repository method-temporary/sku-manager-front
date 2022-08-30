import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, RouteComponentProps } from 'react-router';
import { Button, Container, RadioProps } from 'semantic-ui-react';
import moment from 'moment';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { patronInfo } from '@nara.platform/dock';

import { UserGroupRuleModel } from 'shared/model';
import { AccessRuleService } from 'shared/present';
import { alert, AlertModel, confirm, ConfirmModel, SubActions, Loader, Polyglot } from 'shared/components';
import { ALL_LANGUAGES } from 'shared/components/Polyglot';
import { LoaderService } from 'shared/components/Loader';
import { MenuAuthority } from 'shared/ui';

import { UserGroupCategoryService, UserGroupService } from '../../../usergroup';
import { UserService } from '../../index';
import UserUserGroupSettingView from '../view/UserUserGroupSettingView';
import UserBasicInfoView from '../view/UserBasicInfoView';
import UserResetPassWordModal from '../view/UserResetPassWordModal';
import { UserWorkspaceService } from '../../../userworkspace';
import { UserModel } from '../../model/UserModel';
import FavoriteInfoView from '../view/FavoriteInfoView';
import { CollegeService } from '../../../college';
import { UserGroupSelectService } from 'shared/components/UserGroupSelect';
import UserGroupSequenceModel from '../../../usergroup/group/model/UserGroupSequenceModel';

interface Props extends RouteComponentProps<Params> {}

interface Params {
  cineroomId: string;
  userId: string;
}

interface State {
  cineroomIds: string[] | undefined;
  updatable: boolean;
}

interface Injected {
  userService: UserService;
  accessRuleService: AccessRuleService;
  userGroupService: UserGroupService;
  userWorkspaceService: UserWorkspaceService;
  userGroupCategoryService: UserGroupCategoryService;
  collegeService: CollegeService;
  loaderService: LoaderService;
  userGroupSelectService: UserGroupSelectService;
}

@inject(
  'userService',
  'accessRuleService',
  'userGroupService',
  'userWorkspaceService',
  'userGroupCategoryService',
  'collegeService',
  'loaderService',
  'userGroupSelectService'
)
@observer
@reactAutobind
class UserDefaultDetailContainer extends ReactComponent<Props, State, Injected> {
  //
  state: State = {
    cineroomIds: undefined,
    updatable: false,
  };

  constructor(props: Props) {
    //
    super(props);
    this.init();
  }

  async init() {
    //
    const { userService, userGroupService, loaderService } = this.injected;
    const { userId } = this.props.match.params;

    const { findUserGroupMap } = userGroupService;
    const { findUserByUserId, clearUser } = userService;

    clearUser();

    loaderService.openLoader(true);

    await findUserGroupMap();
    const skProfileWiths = await findUserByUserId(userId);
    loaderService.closeLoader(true, 'info');

    this.setSkProfileAccessRule(skProfileWiths.user);
  }

  async setSkProfileAccessRule(user: UserModel) {
    //
    const { userGroupService, accessRuleService, loaderService } = this.injected;

    const { userGroupMap } = userGroupService;
    const accessRole: UserGroupRuleModel[] = [];

    await (user &&
      user.userGroupSequences &&
      user.userGroupSequences.sequences &&
      user.userGroupSequences.sequences.forEach((sequence: number) => {
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
      }));

    await this.getCineroomIds();
    await accessRuleService.setAccessRules(accessRole);

    loaderService.closeLoader(true, 'userGroup');
  }

  async getCineroomIds() {
    //
    const cineroomId = this.props.match.params.cineroomId;
    const { userService, userWorkspaceService } = this.injected;

    const { user } = userService;
    const { getWorkSpaceByUsId } = userWorkspaceService;

    const cineroomIds: string[] = [];

    if (cineroomId === 'ne1-m2-c2') {
      const userWorkspace = await getWorkSpaceByUsId(user.companyCode);

      cineroomIds.push('ne1-m2-c2');
      cineroomIds.push(userWorkspace.id);

      this.setState({ cineroomIds });
    }
  }

  onChangeGender(e: React.SyntheticEvent<HTMLInputElement>, { value }: RadioProps) {
    //
    // this.injected.userService.setSkProfileProp('gender', value);
    this.injected.userService.changeUserInfoUdoQueryProp('gender', value);
  }

  onChangeBirthDate(data: Date) {
    //
    // this.injected.userService.setSkProfileProp('birthDate', moment(data).format('yyyy-MM-DD').toString());
    this.injected.userService.changeUserInfoUdoQueryProp('birthDate', moment(data).format('yyyy-MM-DD').toString());
  }

  onSaveSkProfileInfo() {
    //
    const { userService, accessRuleService } = this.injected;

    const { userDetail, modifyUserInfo, changeUserInfoUdoQueryProp } = userService;

    changeUserInfoUdoQueryProp('email', userDetail.user.email);
    changeUserInfoUdoQueryProp(
      'userGroupSequences',
      new UserGroupSequenceModel(accessRuleService.accessRules.map((accessRole) => accessRole.seq))
    );

    modifyUserInfo();
  }

  onClickPassWordModalOk(password: string, close: () => void) {
    //
    const { user } = this.injected.userService.userDetail;

    confirm(
      ConfirmModel.getCustomConfirm('Reset Password', '비밀번호를 초기화하시겠습니까?', false, 'Reset', 'Cancel', () =>
        this.modifySkProfileDefaultPassword(password, user.email, close)
      )
    );
    //  skProfile.member.email
  }

  modifySkProfileDefaultPassword(password: string, email: string, close: () => void) {
    //
    const { userService } = this.injected;
    const { modifyUserDefaultPassword } = userService;

    modifyUserDefaultPassword(password, email).then((response) => {
      if (response.errorCode === 0) {
        alert(AlertModel.getSaveSuccessAlert(close));
      } else {
        alert(AlertModel.getCustomAlert(false, 'Saving Failed', response.errorMessage, 'Ok'));
      }
    });
  }

  async onSave() {
    //
    this.injected.loaderService.openLoader();
    await this.onSaveSkProfileInfo();
    this.injected.userGroupSelectService.clearSelectedCategoryId();
    this.injected.userGroupSelectService.clearSelectedCategoryName();
    this.setState({ updatable: false });
    this.injected.loaderService.closeLoader();
    alert(AlertModel.getSaveSuccessAlert());
  }

  routeToSkProfileList() {
    //
    this.props.history.push(`/cineroom/${this.props.match.params.cineroomId}/user-management/user/user-list`);
  }

  render() {
    const { userDetail, userInfoUdoQuery } = this.injected.userService;
    const roles = patronInfo.getPatronRoles(patronInfo.getCineroomId());
    const { channelMap, jobDutyMap, jobGroupMap } = this.injected.collegeService;

    return (
      <Container fluid>
        <Polyglot languages={ALL_LANGUAGES}>
          <Loader name="info">
            <UserBasicInfoView
              updatable={this.state.updatable}
              skProfileInfoUdoQuery={userInfoUdoQuery}
              userDetail={userDetail}
              onChangeGender={this.onChangeGender}
              onChangeBirthDate={this.onChangeBirthDate}
            />
          </Loader>
          <Loader name="info">
            <FavoriteInfoView
              additionalUserInfo={userDetail.additionalUserInfo}
              channelMap={channelMap}
              jobDutyMap={jobDutyMap}
              jobGroupMap={jobGroupMap}
            />
          </Loader>

          <Loader name="userGroup">
            <UserUserGroupSettingView readonly={!this.state.updatable} companyCode={userDetail?.user.companyCode} />
          </Loader>
          <SubActions form>
            <SubActions.Left>
              {this.state.updatable ? (
                <Button
                  onClick={() => {
                    this.setState({ updatable: false });
                    this.injected.userGroupSelectService.clearSelectedCategoryId();
                    this.injected.userGroupSelectService.clearSelectedCategoryName();
                    this.init();
                  }}
                >
                  취소
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    this.setState({ updatable: true });
                  }}
                >
                  수정
                </Button>
              )}

              {/* 20022-02 김민준 권한 변경  */}
              <MenuAuthority permissionAuth={{ isSuperManager: true }}>
                {/* {(roles.includes('CollegeManager') || roles.includes('SuperManager')) && ( */}
                <UserResetPassWordModal onClickOk={this.onClickPassWordModalOk} />
                {/* )} */}
              </MenuAuthority>
            </SubActions.Left>
            <SubActions.Right>
              {this.state.updatable && (
                <Button type="button" primary onClick={this.onSave}>
                  저장
                </Button>
              )}
              <Button type="button" onClick={this.routeToSkProfileList}>
                목록
              </Button>
            </SubActions.Right>
          </SubActions>
        </Polyglot>
      </Container>
    );
  }
}

export default withRouter(UserDefaultDetailContainer);
