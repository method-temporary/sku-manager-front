import { PolyglotModel } from 'shared/model';

import { UserGroupCategoryQueryModel } from './UserGroupCategoryQueryModel';

export class UserGroupCategoryCdo {
  name: PolyglotModel = new PolyglotModel(); // 사용자 그룹 분류 명

  constructor(userGroupCategoryQuery?: UserGroupCategoryQueryModel) {
    //
    if (userGroupCategoryQuery) {
      Object.assign(this, { name: userGroupCategoryQuery.name });
    }
  }
}
