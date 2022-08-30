import { observable, action, runInAction } from 'mobx';
import autobind from 'autobind-decorator';
import { OffsetElementList } from '@nara.platform/accent';
import _ from 'lodash';

import { PageModel } from 'shared/model';

import UserGroupSequenceModel from '../../../usergroup/group/model/UserGroupSequenceModel';
import UserGroupAssignModel from '../../../usergroup/group/model/UserGroupAssignModel';
import { UserGroupMemberQueryModel } from '../../../usergroup/group/model';

import UserApi from '../apiclient/UserApi';

import { UserQueryModel } from '../../model/UserQueryModel';
import { UserModel } from '../../model/UserModel';
import { StudySummary } from '../../model/StudySummary';
import UserGroupMemberModel from '../../../usergroup/group/model/UserGroupMemberModel';
import { UserGroupMemberRdo } from '../../../usergroup/group/model';
import { UserExcelUploadModel } from '../../model/UserExcelUploadModel';
import { UserInfoUdo } from '../../model/UserInfoUdo';
import { UserInfoUdoQueryModel } from '../../model/UserInfoUdoQueryModel';
import { UserWithPisAgreement } from '../../model/UserWithPisAgreement';
import { UserDetailModel } from '../../model/UserDetailModel';

@autobind
class UserService {
  //
  static instance: UserService;

  userApi: UserApi;

  @observable
  user: UserModel = new UserModel();

  @observable
  userDetail: UserDetailModel = new UserDetailModel();

  @observable
  users: OffsetElementList<UserWithPisAgreement> = { results: [], totalCount: 0 };

  @observable
  userQuery: UserQueryModel = new UserQueryModel();

  @observable
  userInfoUdoQuery: UserInfoUdoQueryModel = new UserInfoUdoQueryModel();

  @observable
  userUserGroupMembers: UserGroupMemberModel[] = [];

  @observable
  userUserGroupMembersForExcel: UserGroupMemberModel[] = [];

  @observable
  userList: UserModel[] = [];

  constructor(userApi: UserApi) {
    this.userApi = userApi;
  }

  @action
  async findUser() {
    //
    const user = await this.userApi.findUser();
    return runInAction(() => (this.user = new UserModel(user)));
  }

  @action
  async findUserByUserId(userId: string) {
    //
    const userDetail = await this.userApi.findUserById(userId);
    return runInAction(() => {
      this.userInfoUdoQuery = new UserInfoUdoQueryModel(userDetail.user);
      return (this.userDetail = new UserDetailModel(userDetail));
    });
  }

  @action
  async findAllUserBySearchKey(limit: number = 20) {
    //
    const query = UserQueryModel.asSkProfileRdo(this.userQuery, limit);
    const userWithPisAgreements = await this.userApi.findAllUserBySearchKey(query);

    if (userWithPisAgreements) {
      userWithPisAgreements.results = userWithPisAgreements.results.map(
        (userWithPisAgreement) => new UserWithPisAgreement(userWithPisAgreement)
      );
    }
    return runInAction(() => (this.users = userWithPisAgreements));
  }

  @action
  async findAllUserForExcel(limit: number = 20): Promise<UserWithPisAgreement[]> {
    //
    const query = UserQueryModel.asSkProfileRdo(this.userQuery, limit);
    const userWithPisAgreements = await this.userApi.findAllUserBySearchKey(query);

    if (userWithPisAgreements) {
      userWithPisAgreements.results = userWithPisAgreements.results.map(
        (userWithPisAgreement) => new UserWithPisAgreement(userWithPisAgreement)
      );
    }

    return userWithPisAgreements.results;
  }

  @action
  async findUserUserGroupMember(
    userGroupMemberQueryModel: UserGroupMemberQueryModel,
    pageModel: PageModel
  ): Promise<number> {
    const userWithPisAgreement = await this.userApi.findAllUserBySearchKey(
      new UserGroupMemberRdo(userGroupMemberQueryModel, pageModel)
    );

    runInAction(() => {
      this.userUserGroupMembers = userWithPisAgreement.results.map(
        (userWithPisAgreement) => new UserGroupMemberModel(userWithPisAgreement.user)
      );
    });

    return userWithPisAgreement.totalCount;
  }

  @action
  async findAllUserUserGroupMemberForExcel(userGroupMemberQueryModel: UserGroupMemberQueryModel): Promise<number> {
    //
    const userWithPisAgreement = await this.userApi.findAllUserBySearchKey(
      new UserGroupMemberRdo(userGroupMemberQueryModel, new PageModel(0, 99999999))
    );

    runInAction(() => {
      this.userUserGroupMembersForExcel = userWithPisAgreement.results.map(
        (userWithPisAgreement) => new UserGroupMemberModel(userWithPisAgreement.user)
      );
    });

    return userWithPisAgreement.totalCount;
  }

  @action
  modifyUserDefaultPassword(password: string, email: string) {
    //
    return this.userApi.modifyUserDefaultPassword(password, email);
  }

  @action
  modifyUserInfo() {
    //
    return this.userApi.modifyUserInfo(new UserInfoUdo(this.userInfoUdoQuery));
  }

  @action
  assignUserGroupUser(memberIds: string[], sequences: number[]) {
    //
    this.userApi.modifyUserAssignUserGroup(new UserGroupAssignModel(memberIds, new UserGroupSequenceModel(sequences)));
  }

  @action
  reAssignUserGroupUser(memberIds: string[], sequences: number[]) {
    //
    this.userApi.modifyUserReAssignUserGroup(
      new UserGroupAssignModel(memberIds, new UserGroupSequenceModel(sequences))
    );
  }

  @action
  disAssignUserGroupUser(memberIds: string[], sequences: number[]) {
    //
    this.userApi.modifyUserWithdrawUserGroup(
      new UserGroupAssignModel(memberIds, new UserGroupSequenceModel(sequences))
    );
  }

  @action
  reassignUserGroupWithExcel(userExcelUpload: UserExcelUploadModel[]) {
    //
    return this.userApi.reassignUserGroupWithExcel(userExcelUpload);
  }

  @action
  onChangeUserQueryProp(name: string, value: any) {
    this.userQuery = _.set(this.userQuery, name, value);
  }

  @action
  changeUserUserGroupMembersProp(index: number, name: string, value: any) {
    //
    this.userUserGroupMembers = _.set(this.userUserGroupMembers, `[${index}].${name}`, value);
  }

  @action
  changeUserInfoUdoQueryProp(name: string, value: any) {
    //
    this.userInfoUdoQuery = _.set(this.userInfoUdoQuery, name, value);
  }

  @action
  setUserProp(name: string, value: any) {
    this.user = _.set(this.user, name, value);
  }

  @action
  clearUser() {
    this.user = new UserModel();
  }

  @action
  clearUserQuery() {
    //
    this.userQuery = new UserQueryModel();
  }

  @action
  changeUserQueryProp(name: string, value: any) {
    //
    this.userQuery = _.set(this.userQuery, name, value);
  }

  @action
  changeUserProp(index: number, name: string, value: any) {
    //
    this.users = _.set(this.users, `results[${index}].user.${name}`, value);
  }

  @action
  changeUserListProp(index: number, name: string, value: any) {
    //
    this.userList = _.set(this.userList, `[${index}].${name}`, value);
  }
}

UserService.instance = new UserService(UserApi.instance);
export default UserService;
