import { decorate, observable } from 'mobx';
import { AccessRule } from './AccessRule';
import UserGroupRuleModel from './UserGroupRuleModel';
import { GroupBasedAccessRuleModel } from './GroupBasedAccessRuleModel';
import { GroupAccessRule } from './GroupAccessRule';

export class GroupBasedAccessRule {
  //
  useWhitelistPolicy: boolean = true;
  accessRules: AccessRule[] = [];

  constructor(groupBasedAccessRule?: GroupBasedAccessRule) {
    if (groupBasedAccessRule && groupBasedAccessRule.accessRules) {
      const accessRules = groupBasedAccessRule.accessRules.map((accessRule) => new AccessRule(accessRule));
      Object.assign(this, { ...groupBasedAccessRule, accessRules });
    }
  }

  static getRuleValueString(accessRules: UserGroupRuleModel[]): string {
    //
    const categoryNames = Array.from(new Set(accessRules.map((accessRule) => accessRule.categoryName)));

    return `${categoryNames.map(
      (categoryName) =>
        `[${categoryName}] : ${accessRules
          .filter((accessRule) => accessRule.categoryName === categoryName)
          .map((accessRule) => accessRule.userGroupName)}`
    )}`;
  }

  static asGroupBasedAccessRuleModel(
    groupBasedAccessRule: GroupBasedAccessRule,
    userGroupMap: Map<number, UserGroupRuleModel>
  ): GroupBasedAccessRuleModel {
    //
    const accessRules: GroupAccessRule[] = groupBasedAccessRule.accessRules.map(
      (accessRule): GroupAccessRule =>
        new GroupAccessRule(
          accessRule.groupSequences
            .map(
              (groupSequence): UserGroupRuleModel => {
                const userGroup = userGroupMap.get(groupSequence);
                return new UserGroupRuleModel(
                  userGroup?.categoryId,
                  userGroup?.categoryName,
                  userGroup?.userGroupId,
                  userGroup?.userGroupName,
                  userGroup?.seq
                );
              }
            )
            .filter((userGroupRuleModel) => userGroupRuleModel.categoryId !== null)
        )
    );
    const groupBasedAccessRuleModel = new GroupBasedAccessRuleModel();

    groupBasedAccessRuleModel.useWhitelistPolicy = groupBasedAccessRule.useWhitelistPolicy;
    groupBasedAccessRuleModel.accessRules = accessRules;

    return groupBasedAccessRuleModel;
  }
}

decorate(GroupBasedAccessRule, {
  useWhitelistPolicy: observable,
  accessRules: observable,
});
