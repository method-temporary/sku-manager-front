import { decorate, observable } from 'mobx';
import UserGroupRuleModel from './UserGroupRuleModel';

export class GroupAccessRule {
  //
  groupRules: UserGroupRuleModel[] = [];

  constructor(accessRoles?: UserGroupRuleModel[]) {
    if (accessRoles) {
      this.groupRules = accessRoles;
    }
  }
}

decorate(GroupAccessRule, {
  groupRules: observable,
});
