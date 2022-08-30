import { UserGroupCategoryModel } from './UserGroupCategoryModel';
import { UserGroupModel } from '../../group/model';

export default class UserGroupCategoryWithUserGroups {
  //
  userGroupCategory: UserGroupCategoryModel = new UserGroupCategoryModel();
  userGroups: UserGroupModel[] = [];

  constructor(userGroupCategoryWithUserGroups?: UserGroupCategoryWithUserGroups) {
    if (userGroupCategoryWithUserGroups) {
      Object.assign(this, { ...userGroupCategoryWithUserGroups });
    }
  }
}
