import { autobind } from '@nara.platform/accent';
import { action, observable } from 'mobx';
import _ from 'lodash';

import { GroupBasedAccessRuleModel, UserGroupRuleModel, GroupAccessRule } from '../../model';

@autobind
export class AccessRuleService {
  //
  static instance: AccessRuleService;

  @observable
  groupBasedAccessRule: GroupBasedAccessRuleModel = new GroupBasedAccessRuleModel();

  @observable
  accessRules: UserGroupRuleModel[] = [];

  @observable
  accessRule: UserGroupRuleModel = new UserGroupRuleModel();

  /* groupBasedAccessRole ------------------- */

  @action
  setGroupBasedAccessRule(groupBasedAccessRule: GroupBasedAccessRuleModel) {
    //
    this.groupBasedAccessRule = groupBasedAccessRule;
  }

  @action
  changeGroupBasedAccessRuleProp(name: string, value: any): void {
    //
    this.groupBasedAccessRule = _.set(this.groupBasedAccessRule, name, value);
  }

  @action
  modifyAccessRuleInGroupBasedAccessRule(index: number, groupRules: UserGroupRuleModel[]) {
    //
    this.groupBasedAccessRule.accessRules.splice(index, 1, new GroupAccessRule(groupRules));
  }

  @action
  removeAccessRuleInGroupBasedAccessRule(index: number) {
    //
    this.groupBasedAccessRule.accessRules.splice(index, 1);
  }

  @action
  clearGroupBasedAccessRule(): void {
    this.groupBasedAccessRule = new GroupBasedAccessRuleModel();
  }

  /* accessRules ------------------- */

  @action
  setAccessRules(accessRules: UserGroupRuleModel[]): void {
    //
    this.accessRules = accessRules;
  }

  @action
  clearAccessRules(): void {
    //
    this.accessRules = [];
  }
}

AccessRuleService.instance = new AccessRuleService();
export default AccessRuleService;
