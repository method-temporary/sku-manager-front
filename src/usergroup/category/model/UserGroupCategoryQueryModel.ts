import { decorate, observable } from 'mobx';
import { QueryModel } from 'shared/model';

import { NameValueList, PatronKey, PolyglotModel } from 'shared/model';
import { LangSupport, ALL_LANGUAGES } from 'shared/components/Polyglot';

import { UserGroupCategoryModel } from './index';

export class UserGroupCategoryQueryModel extends QueryModel {
  //
  id: string = '';
  name: PolyglotModel = new PolyglotModel();
  cineroomId: string = '';
  userGroups: Array<any> = new Array<any>();
  patronKey: PatronKey = new PatronKey();
  registrantName: string = '';
  registeredTime: number = 0;
  enabled: boolean = true;
  searchEnabled: string = '1';

  // languages: string[] = [];
  // defaultLanguage: string = '';
  langSupports: LangSupport[] = ALL_LANGUAGES;

  constructor(userGroupCategoryQuery?: UserGroupCategoryQueryModel) {
    super();

    if (userGroupCategoryQuery) {
      const name =
        (userGroupCategoryQuery.name && new PolyglotModel(userGroupCategoryQuery.name)) || new PolyglotModel();

      const langSupports = ALL_LANGUAGES;

      Object.assign(this, { ...userGroupCategoryQuery, name, langSupports });
    }
  }

  static asNameValues(userGroupCategoryQuery: UserGroupCategoryQueryModel): NameValueList {
    //
    return {
      nameValues: [
        {
          name: 'name',
          value: JSON.stringify(userGroupCategoryQuery.name),
        },
      ],
    };
  }

  static asIdValues(userGroupCategoryIds: string | UserGroupCategoryModel[]): string[] {
    //
    const idValues: string[] = [];

    if (typeof userGroupCategoryIds === 'string') {
      idValues.push(userGroupCategoryIds);
    } else {
      userGroupCategoryIds &&
        userGroupCategoryIds.forEach((userGroupCategory) => {
          idValues.push(userGroupCategory.id);
        });
    }

    return idValues;
  }
}

decorate(UserGroupCategoryQueryModel, {
  cineroomId: observable,
  name: observable,
  userGroups: observable,
  registrantName: observable,
  registeredTime: observable,
  enabled: observable,
  searchEnabled: observable,
  langSupports: observable,
});
