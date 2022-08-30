import MonthlyMembershipStatistics from './MonthlyMembershipStatistics';

export default class MonthlyMembershipStatisticsList {
  id: string = '';
  name: String = '';
  value: MonthlyMembershipStatistics[] = [];

  constructor(monthlyMembershipStatisticsList?: MonthlyMembershipStatisticsList) {
    if (monthlyMembershipStatisticsList) {
      Object.assign(this, { ...monthlyMembershipStatisticsList});
    }
  }
}
