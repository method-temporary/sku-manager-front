import { decorate, observable } from 'mobx';

import { UserGroupRuleModel } from 'shared/model';

import { AccessRule } from './AccessRule';
import { GroupAccessRule } from './GroupAccessRule';
import { GroupBasedAccessRule } from './GroupBasedAccessRule';

//FIXME: 테스트 완료 후 주석 모두 제거
export class GroupBasedAccessRuleModel {
  //
  useWhitelistPolicy: boolean = true;
  accessRules: GroupAccessRule[] = [];

  constructor(groupBasedAccessRule?: GroupBasedAccessRuleModel) {
    if (groupBasedAccessRule) {
      Object.assign(this, { ...groupBasedAccessRule });
    }
  }

  static getRuleValueString(accessRoleModels: UserGroupRuleModel[]): string {
    //
    const categoryNames = Array.from(new Set(accessRoleModels.map((accessRule) => accessRule.categoryName)));

    return `${categoryNames.map(
      (categoryName) =>
        `[${categoryName}] : ${accessRoleModels
          .filter((accessRule) => accessRule.categoryName === categoryName)
          .map((accessRule) => accessRule.userGroupName)}`
    )}`;
  }

  static asGroupBasedAccessRule(groupAccessRuleModel: GroupBasedAccessRuleModel): GroupBasedAccessRule {
    //
    const returnValue = new GroupBasedAccessRule();

    returnValue.useWhitelistPolicy = groupAccessRuleModel.useWhitelistPolicy;
    returnValue.accessRules = groupAccessRuleModel.accessRules.map((groupAccessRole, index) => {
      const accessRule = new AccessRule();
      groupAccessRole.groupRules.forEach((accessRole) => {
        accessRule.groupSequences.push(accessRole.seq);
      });
      return accessRule;
    });

    return returnValue;
  }

  static asRuleModelForRule(accessRule: GroupBasedAccessRule): GroupBasedAccessRuleModel {
    //
    const ruleModel = new GroupBasedAccessRuleModel();
    const groupAccessRules: GroupAccessRule[] = [];

    accessRule.accessRules &&
      accessRule.accessRules.forEach((accessRule) => {
        const accessRules: UserGroupRuleModel[] = [];
        accessRule.groupSequences &&
          accessRule.groupSequences.forEach((seq) => {
            accessRules.push(new UserGroupRuleModel('', '', '', '', seq));
          });

        groupAccessRules.push(new GroupAccessRule(accessRules));
      });

    return {
      useWhitelistPolicy: accessRule.useWhitelistPolicy,
      accessRules: groupAccessRules,
      isAccessible: ruleModel.isAccessible,
    };
  }

  isAccessible(
    groupBasedAccessRule: GroupBasedAccessRule,
    groupBasedAccessRuleModel?: GroupBasedAccessRuleModel
  ): boolean {
    //
    const useWhitelistPolicy = groupBasedAccessRuleModel
      ? groupBasedAccessRuleModel.useWhitelistPolicy
      : this.useWhitelistPolicy;
    const accessRules = groupBasedAccessRuleModel ? groupBasedAccessRuleModel.accessRules : this.accessRules;

    if (groupBasedAccessRule.accessRules.length <= 0) {
      // console.log(`target is empty`);
      return false;
    }
    if (accessRules.length <= 0) {
      // console.log(`current is empty`);
      return false;
    }

    if (groupBasedAccessRule.useWhitelistPolicy && useWhitelistPolicy) {
      // target whitelist + current whitelist
      for (const accessRule of accessRules) {
        const currentAccessRule = AccessRule.fromGroupAccessRule(accessRule);
        for (const targetAccessRule of groupBasedAccessRule.accessRules) {
          if (targetAccessRule.contains(currentAccessRule)) {
            // console.log(
            //   `target[Whitelist]${
            //     targetAccessRule.groupSequences
            //   } / current[WhiteList]${currentAccessRule.groupSequences.map((sequence) => sequence)}`
            // );
            // console.log(`true`);
            return true;
          }
        }
      }
    } else if (groupBasedAccessRule.useWhitelistPolicy && !useWhitelistPolicy) {
      // target whitelist + current blacklist
      for (const accessRule of accessRules) {
        const currentAccessRule = AccessRule.fromGroupAccessRule(accessRule);
        for (const targetAccessRule of groupBasedAccessRule.accessRules) {
          if (currentAccessRule.contains(targetAccessRule)) {
            // console.log(
            //   `target[Whitelist]${
            //     targetAccessRule.groupSequences
            //   } / current[Blacklist]${currentAccessRule.groupSequences.map((sequence) => sequence)}`
            // );
            // console.log(`false`);
            return false;
          }
        }
      }
      // console.log(`current[Blacklist] is not matched target[Whitelist]`);
      // console.log(`true`);
      return true;
    } else if (!groupBasedAccessRule.useWhitelistPolicy && useWhitelistPolicy) {
      // target blacklist + current whitelist
      for (const accessRule of accessRules) {
        const currentAccessRule = AccessRule.fromGroupAccessRule(accessRule);
        for (const targetAccessRule of groupBasedAccessRule.accessRules) {
          if (targetAccessRule.contains(currentAccessRule)) {
            // console.log(
            //   `target[Blacklist]${
            //     targetAccessRule.groupSequences
            //   } / current[Whitelist]${currentAccessRule.groupSequences.map((sequence) => sequence)}`
            // );
            // console.log(`false`);
            return false;
          }
        }
      }
      // console.log(`target[Blacklist] is not matched current[Whitelist]`);
      // console.log(`true`);
      return true;
    } else if (!groupBasedAccessRule.useWhitelistPolicy && !useWhitelistPolicy) {
      // target blacklist + current blacklist
      for (const accessRule of accessRules) {
        const currentAccessRule = AccessRule.fromGroupAccessRule(accessRule);
        for (const targetAccessRule of groupBasedAccessRule.accessRules) {
          if (currentAccessRule.contains(targetAccessRule)) {
            // console.log(
            //   `target[Blacklist]${
            //     targetAccessRule.groupSequences
            //   } / current[Blacklist]${currentAccessRule.groupSequences.map((sequence) => sequence)}`
            // );
            // console.log(`false`);
            return false;
          }
        }
      }
    } else {
      // console.log(`wrong whitelist value`);
      return false;
    }

    // console.log(
    //   groupBasedAccessRule.accessRules.map((accessRule) => accessRule.groupSequences.map((sequence) => sequence))
    // );
    // console.log(accessRules.map((accessRule) => accessRule.groupRules.map((groupRule) => groupRule.seq)));
    // console.log(`missing somethings`);
    // console.log('false');
    return false;
    // if (groupBasedAccessRule.useWhitelistPolicy) {
    //   if (this.useWhitelistPolicy) {
    //     // target whitelist + current whitelist
    //     ho = groupBasedAccessRule.accessRules.filter((targetAccessRule) =>
    //       targetAccessRule.groupSequences.forEach((targetSequence) =>
    //         this.accessRules.forEach((currentAccessRule) =>
    //           currentAccessRule.groupRules.forEach((currentRule) => {
    //             if (targetSequence !== currentRule.seq) {
    //               console.log(`target[Whitelist]${targetSequence} / current[WhiteList]${currentRule.seq}`);
    //               console.log(`false`);
    //               isAccessible = false;
    //               ho.push(isAccessible);
    //             }
    //           })
    //         )
    //       )
    //     );
    //   } else {
    //     // target whitelist + current blacklist
    //     ho = groupBasedAccessRule.accessRules.filter((targetAccessRule) =>
    //       targetAccessRule.groupSequences.forEach((targetSequence) =>
    //         this.accessRules.forEach((currentAccessRule) =>
    //           currentAccessRule.groupRules.forEach((currentRule) => {
    //             if (targetSequence === currentRule.seq) {
    //               console.log(`target[Whitelist]${targetSequence} / current[Blacklist]${currentRule.seq}`);
    //               console.log(`false`);
    //               isAccessible = false;
    //               ho.push(isAccessible);
    //             }
    //           })
    //         )
    //       )
    //     );
    //   }
    // } else {
    //   if (this.useWhitelistPolicy) {
    //     // target blacklist + current whitelist
    //     ho = this.accessRules.filter((currentAccessRule) =>
    //       currentAccessRule.groupRules.forEach((currentRule) =>
    //         groupBasedAccessRule.accessRules.forEach((targetAccessRule) =>
    //           targetAccessRule.groupSequences.forEach((targetSequence) => {
    //             if (targetSequence === currentRule.seq) {
    //               console.log(`target[Blacklist]${targetSequence} / current[Whitelist]${currentRule.seq}`);
    //               console.log(`false`);
    //               isAccessible = false;
    //               ho.push(isAccessible);
    //             }
    //           })
    //         )
    //       )
    //     );
    //   } else {
    //     // target blacklist + current blacklist
    //     ho = this.accessRules.filter((currentAccessRule) =>
    //       currentAccessRule.groupRules.forEach((currentRule) =>
    //         groupBasedAccessRule.accessRules.forEach((targetAccessRule) =>
    //           targetAccessRule.groupSequences.forEach((targetSequence) => {
    //             if (targetSequence !== currentRule.seq) {
    //               console.log(`target[Blacklist]${targetSequence} / current[Blacklist]${currentRule.seq}`);
    //               console.log(`false`);
    //               isAccessible = false;
    //             }
    //           })
    //         )
    //       )
    //     );
    //   }
    // }
    // return isAccessible;
  }
}

decorate(GroupBasedAccessRuleModel, {
  useWhitelistPolicy: observable,
  accessRules: observable,
});
