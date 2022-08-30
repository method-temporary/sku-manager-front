import { decorate, observable } from 'mobx';
import { GroupAccessRule } from './GroupAccessRule';

export class AccessRule {
  //
  groupSequences: number[] = [];

  constructor(accessRule?: AccessRule) {
    if (accessRule) {
      Object.assign(this, { ...accessRule });
    }
  }

  static fromGroupAccessRule(groupAccessRule: GroupAccessRule): AccessRule {
    //
    const accessRule = new AccessRule();
    accessRule.groupSequences = groupAccessRule.groupRules.map((groupRule) => groupRule.seq);

    return accessRule;
  }

  contains(target: AccessRule): boolean {
    //
    return this.equals(this.and(this, target));
  }

  and(source: AccessRule, target: AccessRule): AccessRule {
    //
    const accessRule = new AccessRule();
    accessRule.groupSequences = source.groupSequences.filter((sourceGroupSequence) =>
      target.groupSequences.includes(sourceGroupSequence)
    );
    return accessRule;
  }

  equals(obj: Object): boolean {
    if (typeof obj !== 'object') {
      return false;
    }
    const arr1 = JSON.stringify(this);
    const arr2 = JSON.stringify(obj);

    return arr1 === arr2;
  }
}

decorate(AccessRule, {
  groupSequences: observable,
});
