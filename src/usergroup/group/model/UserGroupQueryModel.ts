import { decorate, observable } from 'mobx';

import { NameValueList, QueryModel, PolyglotModel } from 'shared/model';
import { ALL_LANGUAGES, LangSupport } from 'shared/components/Polyglot';

import { UserGroupCategoryQueryModel } from '../../category/model';
import { UserGroupModel } from './index';

export class UserGroupQueryModel extends QueryModel {
  //
  currentPage: number = 0;
  page: number = 0;
  pageIndex: number = 0;

  id: string = '';
  name: PolyglotModel = new PolyglotModel();
  cineroomId: string = '';
  userGroupCategory: UserGroupCategoryQueryModel = new UserGroupCategoryQueryModel();
  registrantName: string = '';
  registeredTime: number = 0;
  userCount: number = 0;
  enabled: boolean = true;

  categoryId: string = '';
  sequence: number = 0;

  checked: boolean = false;

  // languages: string[] = [];
  // defaultLanguage: string = '';
  langSupports: LangSupport[] = ALL_LANGUAGES;

  constructor(userGroupQuery?: UserGroupQueryModel) {
    super();

    if (userGroupQuery) {
      const name = userGroupQuery.name && new PolyglotModel(userGroupQuery.name);
      const userGroupCategory = new UserGroupCategoryQueryModel(userGroupQuery.userGroupCategory);

      Object.assign(this, { ...userGroupQuery, name, userGroupCategory });
    }
  }

  static asNameValues(userGroupQueryModel: UserGroupQueryModel): NameValueList {
    return {
      nameValues: [
        {
          name: 'name',
          value: JSON.stringify(userGroupQueryModel.name),
        },
        {
          name: 'categoryId',
          value: userGroupQueryModel.categoryId,
        },
      ],
    };
  }

  static asIdValues(userGroupIds: UserGroupModel[] | string): string[] {
    //
    const idValues = [];

    if (typeof userGroupIds === 'string') {
      idValues.push(userGroupIds);
    } else {
      userGroupIds &&
        userGroupIds.forEach((userGroup) => {
          idValues.push(userGroup.id);
        });
    }

    return idValues;
  }
}

decorate(UserGroupQueryModel, {
  page: observable,
  cineroomId: observable,
  name: observable,
  registrantName: observable,
  registeredTime: observable,
  categoryId: observable,
  userCount: observable,
  // languages: observable,
  // defaultLanguage: observable,
  langSupports: observable,
});
