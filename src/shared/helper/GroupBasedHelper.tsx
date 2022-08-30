import React from 'react';
import { GroupBasedAccessRule } from '../model';
import UserGroupRuleModel from '../model/UserGroupRuleModel';
import { Icon } from 'semantic-ui-react';

export function getBasedAccessRuleView(
  groupBasedAccessRule: GroupBasedAccessRule,
  userGroupMap: Map<number, UserGroupRuleModel>
) {
  //
  let result = '';

  groupBasedAccessRule.accessRules &&
    groupBasedAccessRule.accessRules.forEach((accessRule, ruleIndex) => {
      if (accessRule.groupSequences) {
        if (ruleIndex > 0) result += ', ';

        accessRule.groupSequences.forEach((seq, seqIndex) => {
          const userGroupRule = userGroupMap.get(seq);

          result +=
            seqIndex === 0
              ? userGroupRule && userGroupRule.userGroupName
              : userGroupRule && `-${userGroupRule.userGroupName}`;
        });
      }
    });

  return (
    <>
      {groupBasedAccessRule.useWhitelistPolicy ? <Icon className="whiteList" /> : <Icon className="blackList" />}
      {result}
    </>
  );
}

export function getBasedAccessRuleViewString(
  groupBasedAccessRule: GroupBasedAccessRule,
  userGroupMap: Map<number, UserGroupRuleModel>
) {
  //
  let result = '';

  groupBasedAccessRule.accessRules &&
    groupBasedAccessRule.accessRules.forEach((accessRule, ruleIndex) => {
      if (accessRule.groupSequences) {
        if (ruleIndex > 0) result += ', ';

        accessRule.groupSequences.forEach((seq, seqIndex) => {
          const userGroupRule = userGroupMap.get(seq);

          result +=
            seqIndex === 0
              ? userGroupRule && userGroupRule.userGroupName
              : userGroupRule && `-${userGroupRule.userGroupName}`;
        });
      }
    });

  return {
    policy: groupBasedAccessRule.useWhitelistPolicy ? 'whiteList' : 'blackList',
    result,
  };
}
