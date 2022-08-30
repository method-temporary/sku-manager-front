import { PolyglotModel } from 'shared/model';
import { ALL_LANGUAGES, LangSupport } from 'shared/components/Polyglot';

import { UserGroupQueryModel } from './UserGroupQueryModel';
import { UserGroupCategoryModel, UserGroupCategoryQueryModel } from '../../category/model';

export class UserGroupModel {
  //
  id: string = '';
  name: PolyglotModel = new PolyglotModel();
  enabled: boolean = true;
  cineroomId: string = '';
  userGroupCategory: UserGroupCategoryQueryModel = new UserGroupCategoryQueryModel();
  categoryName: PolyglotModel = new PolyglotModel();
  categoryId: string = '';
  userCount: number = 0;
  registrantName: PolyglotModel = new PolyglotModel();
  registeredTime: number = 0;
  sequence: number = 0;

  checked: boolean = false;

  langSupports: LangSupport[] = ALL_LANGUAGES;

  constructor(userGroupQueryModel?: UserGroupQueryModel) {
    if (userGroupQueryModel) {
      const userGroupCategory = new UserGroupCategoryModel(userGroupQueryModel.userGroupCategory);
      const name = userGroupQueryModel.name && new PolyglotModel(userGroupQueryModel.name);
      const categoryName =
        (userGroupQueryModel.userGroupCategory && new PolyglotModel(userGroupQueryModel.userGroupCategory.name)) ||
        new PolyglotModel();

      Object.assign(this, {
        cineroomId: userGroupCategory.cineroomId,
        id: userGroupQueryModel.id,
        name,
        enabled: userGroupQueryModel.enabled,
        userGroupCategory,
        categoryName,
        categoryId: userGroupCategory.id,
        registrantName: userGroupQueryModel.registrantName,
        registeredTime: userGroupQueryModel.registeredTime,
        sequence: userGroupQueryModel.sequence,
        userCount: userGroupQueryModel.userCount,
        langSupports: ALL_LANGUAGES,
      });
    }
  }

  static makeUserGroupModel(userGroupModel: UserGroupModel): UserGroupModel {
    //
    return {
      id: userGroupModel.id,
      name: userGroupModel.name,
      enabled: userGroupModel.enabled,
      cineroomId: userGroupModel.cineroomId,
      userGroupCategory: userGroupModel.userGroupCategory,
      categoryName: userGroupModel.categoryName,
      categoryId: userGroupModel.categoryId,
      userCount: userGroupModel.userCount,
      registrantName: userGroupModel.registrantName,
      registeredTime: userGroupModel.registeredTime,
      sequence: userGroupModel.sequence,
      checked: userGroupModel.checked,
      langSupports: userGroupModel.langSupports,
    };
  }
}
