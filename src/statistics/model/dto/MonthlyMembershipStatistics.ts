import { MemberCount } from './MemberCount';
import LearningTime from './LearningTime';

export default class MonthlyMembershipStatistics {
  //
  month: string = '';
  memberCount: MemberCount = new MemberCount();
  learningTime: LearningTime = new LearningTime();

  constructor(monthlyMembershipStatistics?: MonthlyMembershipStatistics) {
    if (monthlyMembershipStatistics) {
      const memberCount = new MemberCount(monthlyMembershipStatistics.memberCount);
      const learningTime = new LearningTime(monthlyMembershipStatistics.learningTime);
      Object.assign(this, { ...monthlyMembershipStatistics, memberCount, learningTime });
    }
  }
}
