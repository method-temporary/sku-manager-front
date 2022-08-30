import { decorate, observable } from 'mobx';

import { PolyglotModel } from 'shared/model';
import { LangSupport, ALL_LANGUAGES } from 'shared/components/Polyglot';

import { UserGroupModel } from '../../group/model';
import { UserGroupCategoryQueryModel } from './UserGroupCategoryQueryModel';

export class UserGroupCategoryModel {
  //
  id: string = ''; // Id
  enabled: boolean = true;
  cineroomId: string = ''; // 사용처
  name: PolyglotModel = new PolyglotModel(); // 사용자 그룹 분류 명
  userGroups: Array<UserGroupModel> = []; // 사용자 그룹
  registrantName: PolyglotModel = new PolyglotModel(); // 생성자
  registeredTime: number = 0; // 등록일자
  checked: boolean = false;

  langSupports: LangSupport[] = ALL_LANGUAGES;

  constructor(userGroupCategoryQuery?: UserGroupCategoryQueryModel) {
    //
    if (userGroupCategoryQuery) {
      const name =
        (userGroupCategoryQuery.name && new PolyglotModel(userGroupCategoryQuery.name)) || new PolyglotModel();

      Object.assign(this, {
        id: userGroupCategoryQuery.id,
        enabled: userGroupCategoryQuery.enabled,
        cineroomId:
          (userGroupCategoryQuery.patronKey &&
            userGroupCategoryQuery.patronKey.keyString.slice(
              userGroupCategoryQuery.patronKey.keyString.indexOf('@') + 1
            )) ||
          '',
        name,
        userGroups: userGroupCategoryQuery.userGroups,
        registrantName: userGroupCategoryQuery.registrantName,
        registeredTime: userGroupCategoryQuery.registeredTime,
        langSupports: ALL_LANGUAGES,
      });
    }
  }
}

decorate(UserGroupCategoryModel, {
  checked: observable,
});
