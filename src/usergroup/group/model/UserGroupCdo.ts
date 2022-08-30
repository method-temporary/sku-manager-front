import { UserGroupQueryModel } from './UserGroupQueryModel';

export class UserGroupCdo {
  name: string = '';
  categoryId: string = '';

  constructor(userGroupQuery?: UserGroupQueryModel) {
    //
    if (userGroupQuery) {
      //
      Object.assign(this, { name: userGroupQuery.name, categoryId: userGroupQuery.categoryId });
    }
  }
}
