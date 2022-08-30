import { action, observable, runInAction } from 'mobx';
import { autobind } from '@nara.platform/accent';
import _ from 'lodash';

import { NameValueList, OffsetElementList, PageModel, SelectTypeModel } from 'shared/model';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import UserGroupCategoryApi from '../apiclient/UserGroupCategoryApi';
import {
  UserGroupCategoryQueryModel,
  UserGroupCategoryModel,
  UserGroupCategoryRdo,
  UserGroupCategoryCdo,
} from '../../model';
import UserGroupCategoryWithUserGroups from '../../model/UserGroupCategoryWithUserGroups';
import { UserGroupModel } from '../../../group/model';

@autobind
class UserGroupCategoryService {
  //
  static instance: UserGroupCategoryService;

  userGroupCategoryApi: UserGroupCategoryApi;

  @observable
  userGroupCategoryQuery: UserGroupCategoryQueryModel = new UserGroupCategoryQueryModel();

  @observable
  userGroupCategoryList: UserGroupCategoryModel[] = [];

  @observable
  userGroupCategory: UserGroupCategoryModel = new UserGroupCategoryModel();

  @observable
  userGroupCategorySelectType: SelectTypeModel[] = [new SelectTypeModel()];

  constructor(userGroupCategoryApi: UserGroupCategoryApi) {
    //
    this.userGroupCategoryApi = userGroupCategoryApi;
  }

  @action
  changeUserGroupCategoryQueryProp(name: string, value: any) {
    //
    this.userGroupCategoryQuery = _.set(this.userGroupCategoryQuery, name, value);
  }

  @action
  changeUserGroupCategoryQueryProps(props: { name: string; value: any }[]) {
    //
    props.forEach(({ name, value }) => {
      this.changeUserGroupCategoryQueryProp(name, value);
    });
  }

  @action
  changeUserGroupCategoryProp(name: string, value: any) {
    //
    this.userGroupCategory = _.set(this.userGroupCategory, name, value);
  }

  @action
  changeUserGroupCategoryListProp(index: number, name: string, value: any) {
    //
    this.userGroupCategoryList = _.set(this.userGroupCategoryList, `[${index}].${name}`, value);
  }

  @action
  async findUserGroupCategories(pageModel: PageModel): Promise<number> {
    //
    const offsetElementList = await this.userGroupCategoryApi.findUserGroupCategories(
      new UserGroupCategoryRdo(this.userGroupCategoryQuery, pageModel)
    );

    runInAction(() => {
      this.userGroupCategoryList = offsetElementList.results.map(
        (userGroupCategoryQuery) => new UserGroupCategoryModel(userGroupCategoryQuery)
      );
    });

    return offsetElementList.totalCount;
  }

  @action
  async findAllUserGroupCategory() {
    //
    const offsetElementList = await this.userGroupCategoryApi.findAllUserGroupCategoriesEnabled(
      this.userGroupCategoryQuery.enabled
    );

    runInAction(() => {
      this.userGroupCategoryList =
        offsetElementList.results &&
        offsetElementList.results.map((userGroupCategoryQuery) => new UserGroupCategoryModel(userGroupCategoryQuery));
    });
  }

  @action
  async findAllUserGroupCategoryFilterCineroomId(cineroomIds: string[]) {
    //
    // console.log('action', cineroomIds);

    const offsetElementList = await this.userGroupCategoryApi.findAllUserGroupCategoriesEnabled(
      this.userGroupCategoryQuery.enabled
    );

    runInAction(() => {
      const newUserGroupCategoryList: UserGroupCategoryModel[] = [];

      offsetElementList.results &&
        offsetElementList.results.forEach((userGroupCategoryQuery) => {
          const userGroupCategoryModel = new UserGroupCategoryModel(userGroupCategoryQuery);

          if (cineroomIds.includes(userGroupCategoryModel.cineroomId)) {
            newUserGroupCategoryList.push(userGroupCategoryModel);
          }
        });

      this.userGroupCategoryList = newUserGroupCategoryList;
    });
  }

  @action
  async findUserGroupCategoriesWithUserGroupsByUserWorkspaceId(
    userWorkspaceId: string
  ): Promise<UserGroupCategoryWithUserGroups[]> {
    //
    const results = await this.userGroupCategoryApi.findUserGroupCategoriesWithUserGroupsByUserWorkspaceId(
      userWorkspaceId
    );

    runInAction(() => {
      this.userGroupCategoryList = results.map((target) => {
        const userGroupCategory = target.userGroupCategory;
        userGroupCategory.userGroups = target.userGroups.map((userGroup) =>
          UserGroupModel.makeUserGroupModel(userGroup)
        );
        return userGroupCategory;
      });
    });

    return results;
  }

  @action
  async findUserGroupCategoriesWithUserGroupsByUserWorkspaceUsid(
    userWorkspaceUsid: string
  ): Promise<UserGroupCategoryWithUserGroups[]> {
    //
    const results = await this.userGroupCategoryApi.findUserGroupCategoriesWithUserGroupsByUserWorkspaceUsid(
      userWorkspaceUsid
    );

    runInAction(() => {
      this.userGroupCategoryList = results.map((target) => target.userGroupCategory);
    });

    return results;
  }

  @action
  async findAllCineroomUserGroupCategoriesEnabled(enabled: boolean) {
    //
    const offsetElementList = await this.userGroupCategoryApi.findAllCineroomUserGroupCategoriesEnabled(enabled);
    runInAction(() => {
      this.userGroupCategoryList = offsetElementList.results.map(
        (userGroupCategoryQuery) => new UserGroupCategoryModel(userGroupCategoryQuery)
      );
    });
  }

  @action
  async findUserGroupCategoryById(userGroupCategoryId: string) {
    //
    const userGroupCategory = await this.userGroupCategoryApi.findUserGroupCategoryById(userGroupCategoryId);

    runInAction(() => {
      this.userGroupCategory = new UserGroupCategoryModel(userGroupCategory);
    });
  }

  @action
  async findUserGroupCategoryByName(
    userGroupCategoryName: string
  ): Promise<OffsetElementList<UserGroupCategoryQueryModel>> {
    //
    const offsetElementList = await this.userGroupCategoryApi.findUserGroupCategoryByName(userGroupCategoryName);

    runInAction(() => {
      offsetElementList.results = offsetElementList.results?.map(
        (userGroupCategoryQuery) => new UserGroupCategoryQueryModel(userGroupCategoryQuery)
      );
    });

    return offsetElementList;
  }

  @action
  async findUserGroupCategorySelectType() {
    //
    const offsetElementList = await this.userGroupCategoryApi.findAllUserGroupCategoriesEnabled(
      this.userGroupCategoryQuery.enabled
    );

    runInAction(() => {
      const userGroupCategorySelectTypeTemp: SelectTypeModel[] = [];
      offsetElementList.results &&
        offsetElementList.results.forEach((userGroupCategory) => {
          userGroupCategorySelectTypeTemp.push(
            new SelectTypeModel(
              userGroupCategory.id,
              getPolyglotToAnyString(userGroupCategory.name),
              userGroupCategory.id
            )
          );
        });

      this.userGroupCategorySelectType = userGroupCategorySelectTypeTemp;
    });
  }

  @action
  async registerUserGroupCategory(userGroupCategoryQuery: UserGroupCategoryQueryModel) {
    //
    return this.userGroupCategoryApi.registerUserGroupCategory(new UserGroupCategoryCdo(userGroupCategoryQuery));
  }

  @action
  async modifyUserGroupCategory(userGroupCategoryId: string, nameValues: NameValueList) {
    //
    return this.userGroupCategoryApi.modifyUserGroupCategory(userGroupCategoryId, nameValues);
  }

  @action
  async removeUserGroupCategory(idValues: string[]) {
    //
    return this.userGroupCategoryApi.removeUserGroupCategory(idValues);
  }

  @action
  async enabledUserGroupCategory(idValues: string[]) {
    //
    return this.userGroupCategoryApi.enabledUserGroupCategory(idValues);
  }

  @action
  async disabledUserGroupCategory(idValues: string[]) {
    //
    return this.userGroupCategoryApi.disabledUserGroupCategory(idValues);
  }

  @action
  clearUserGroupCategoryList() {
    //
    this.userGroupCategoryList = [];
  }

  @action
  clearUserGroupCategory() {
    //
    this.userGroupCategory = new UserGroupCategoryModel();
  }

  @action
  clearUserGroupCategoryQuery() {
    //
    this.userGroupCategoryQuery = new UserGroupCategoryQueryModel();
  }
}

UserGroupCategoryService.instance = new UserGroupCategoryService(UserGroupCategoryApi.instance);
export default UserGroupCategoryService;
