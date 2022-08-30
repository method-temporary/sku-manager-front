import { MemberCount } from './MemberCount';
import LearningTime from './LearningTime';

export default class AnnualMembershipStatistics {
  //
  memberCount: MemberCount = new MemberCount();
  learningTime: LearningTime = new LearningTime();

  constructor(annualMembershipStatistics?: AnnualMembershipStatistics) {
    if (annualMembershipStatistics) {
      const memberCount = new MemberCount(annualMembershipStatistics.memberCount);
      const learningTime = new LearningTime(annualMembershipStatistics.learningTime);
      Object.assign(this, { ...annualMembershipStatistics, learningTime, memberCount });
    }
  }
}
