import { action, observable, runInAction } from 'mobx';
import { autobind } from '@nara.platform/accent';
import _ from 'lodash';

import { NameValueList, OffsetElementList, PageModel, UserGroupRuleModel, SelectTypeModel } from 'shared/model';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import UserGroupApi from '../apiclient/UserGroupApi';
import {
  UserGroupRdo,
  UserGroupQueryModel,
  UserGroupMemberQueryModel,
  UserGroupCdo,
  UserGroupModel,
} from '../../model';
import UserGroupEmailsModel from 'usergroup/group/model/UserGroupEmailslModel';
import UserGroupEmailExcelResultModel from 'usergroup/group/model/UserGroupEmailExcelResultModel';

@autobind
class UserGroupService {
  //
  static instance: UserGroupService;

  userGroupApi: UserGroupApi;

  @observable
  userGroupQuery: UserGroupQueryModel = new UserGroupQueryModel();

  @observable
  userGroupMemberQuery: UserGroupMemberQueryModel = new UserGroupMemberQueryModel();

  @observable
  userGroupList: UserGroupModel[] = [];

  @observable
  userGroup: UserGroupModel = new UserGroupModel();

  @observable
  userGroupSelectType: SelectTypeModel[] = [new SelectTypeModel()];

  @observable
  userGroupMap: Map<number, UserGroupRuleModel> = new Map<number, UserGroupRuleModel>();

  constructor(userGroupApi: UserGroupApi) {
    //
    this.userGroupApi = userGroupApi;
  }

  @action
  changeUserGroupQueryProp(name: string, value: any) {
    //
    this.userGroupQuery = _.set(this.userGroupQuery, name, value);
  }

  @action
  changeUserGroupQueryProps(props: { name: string; value: any }[]) {
    //
    props.forEach(({ name, value }) => {
      this.changeUserGroupQueryProp(name, value);
    });
  }

  @action
  changeUserGroupMemberQueryProps(name: string, value: any) {
    //
    this.userGroupMemberQuery = _.set(this.userGroupMemberQuery, name, value);
  }

  @action
  changeUserGroupProp(name: string, value: any) {
    //
    this.userGroup = _.set(this.userGroup, name, value);
  }

  @action
  changeUserGroupListProp(index: number, name: string, value: any) {
    //
    this.userGroupList = _.set(this.userGroupList, `[${index}].${name}`, value);
  }

  @action
  async findUserGroups(pageModal: PageModel): Promise<number> {
    //
    const offsetElementList = await this.userGroupApi.findUserGroups(new UserGroupRdo(this.userGroupQuery, pageModal));

    runInAction(() => {
      this.userGroupList =
        offsetElementList.results && offsetElementList.results.map((userGroup) => new UserGroupModel(userGroup));
    });
    return offsetElementList.totalCount;
  }

  @action
  async findUserGroupById(userGroupId: string) {
    //
    const userGroup = await this.userGroupApi.findUserGroupById(userGroupId);
    runInAction(() => {
      this.userGroup = new UserGroupModel(userGroup);
    });
  }

  @action
  async findUserGroupByName(userGroupName: string): Promise<OffsetElementList<UserGroupQueryModel>> {
    //
    return this.userGroupApi.findUserGroupByName(userGroupName);
  }

  @action
  async findUserGroupByCategoryId(categoryId: string) {
    //
    const offsetElementList = await this.userGroupApi.findAllUserGroups(categoryId);

    runInAction(() => {
      this.userGroupList = offsetElementList.map((userGroup) => new UserGroupModel(userGroup));
    });
  }

  @action
  async findUserGroupSelectType(categoryId: string) {
    //
    const userGroupRdoList = await this.userGroupApi.findAllUserGroups(categoryId);

    runInAction(() => {
      const userGroupSelectTypeTemp: SelectTypeModel[] = [];
      if (userGroupRdoList.length > 0) {
        userGroupRdoList.forEach((userGroup) => {
          // userGroupSelectTypeTemp.push(new SelectTypeModel(userGroup.id, userGroup.name, userGroup.sequence));
          userGroupSelectTypeTemp.push(
            new SelectTypeModel(`${userGroup.sequence}`, getPolyglotToAnyString(userGroup.name), userGroup.sequence)
          );
        });
      }
      this.userGroupSelectType = userGroupSelectTypeTemp;
    });
  }

  @action
  async findUserGroupMap() {
    //
    const userGroupRdoList = await this.userGroupApi.findAllUserGroup();

    runInAction(() => {
      userGroupRdoList.results &&
        userGroupRdoList.results.forEach((userGroup) => {
          this.userGroupMap.set(
            userGroup.sequence,
            new UserGroupRuleModel(
              userGroup.userGroupCategory.id,
              getPolyglotToAnyString(userGroup.userGroupCategory.name),
              userGroup.id,
              getPolyglotToAnyString(userGroup.name),
              userGroup.sequence
            )
          );
        });
    });
  }

  @action
  async registerUserGroup(userGroupQuery: UserGroupQueryModel) {
    //
    return this.userGroupApi.registerUserGroup(new UserGroupCdo(userGroupQuery));
  }

  @action
  async modifyUserGroup(userGroupId: string, nameValues: NameValueList) {
    //
    return this.userGroupApi.modifyUserGroup(userGroupId, nameValues);
  }

  @action
  async removeUserGroup(idValues: string[]) {
    //
    return this.userGroupApi.removeUserGroup(idValues);
  }

  @action
  async enabledUserGroup(idValues: string[]) {
    //
    return this.userGroupApi.enabledUserGroup(idValues);
  }

  @action
  async disabledUserGroup(idValues: string[]) {
    //
    return this.userGroupApi.disabledUserGroup(idValues);
  }

  @action
  async assignUserGroupByEmail(userGroupEmailsModel: UserGroupEmailsModel): Promise<UserGroupEmailExcelResultModel> {
    //
    return this.userGroupApi.assignUserGroupByEmail(userGroupEmailsModel);
  }

  @action
  setUserGroupList(userGroupList: UserGroupModel[]): void {
    //
    this.userGroupList = userGroupList;
  }

  @action
  clearUserGroupList() {
    //
    this.userGroupList = [];
  }

  @action
  clearUserGroupQuery() {
    //
    this.userGroupQuery = new UserGroupQueryModel();
  }

  @action
  clearUserGroupMemberQuery() {
    //
    this.userGroupMemberQuery = new UserGroupMemberQueryModel();
  }

  @action
  clearUserGroup() {
    //
    this.userGroup = new UserGroupModel();
  }
}

UserGroupService.instance = new UserGroupService(UserGroupApi.instance);
export default UserGroupService;
