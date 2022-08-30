import { GroupAccessRule, GroupBasedAccessRule, GroupBasedAccessRuleModel, UserGroupRuleModel } from '../../model';

export const isAccessible = (
  groupBasedAccessRule: GroupBasedAccessRule,
  groupBasedAccessRuleModel: GroupBasedAccessRuleModel
) => {
  //
  return GroupBasedAccessRuleModel.asRuleModelForRule(groupBasedAccessRule).isAccessible(
    new GroupBasedAccessRule(groupBasedAccessRule),
    groupBasedAccessRuleModel
  );
};

export const setGroupBasedAccessRuleInfo = (
  groupBasedAccessRule: GroupBasedAccessRule,
  userGroupMap: Map<number, UserGroupRuleModel>
) => {
  //
  const accessRules: GroupAccessRule[] =
    (groupBasedAccessRule.accessRules &&
      groupBasedAccessRule.accessRules.map(
        (accessRule): GroupAccessRule =>
          new GroupAccessRule(
            accessRule.groupSequences
              .map((groupSequence): UserGroupRuleModel => {
                const userGroup = userGroupMap.get(groupSequence);
                return new UserGroupRuleModel(
                  userGroup?.categoryId,
                  userGroup?.categoryName,
                  userGroup?.userGroupId,
                  userGroup?.userGroupName,
                  userGroup?.seq
                );
              })
              .filter((userGroupRuleModel) => userGroupRuleModel.categoryId !== null)
          )
      )) ||
    [];

  const groupBasedAccessRuleModel = new GroupBasedAccessRuleModel();

  groupBasedAccessRuleModel.useWhitelistPolicy = groupBasedAccessRule.useWhitelistPolicy;
  groupBasedAccessRuleModel.accessRules = accessRules;

  return groupBasedAccessRuleModel;
};
