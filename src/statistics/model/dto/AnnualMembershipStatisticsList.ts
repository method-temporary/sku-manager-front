import AnnualMembershipStatistics from './AnnualMembershipStatistics';

export default class AnnualMembershipStatisticsList {
  id: String = '';
  name: String = '';
  value: AnnualMembershipStatistics = new AnnualMembershipStatistics();
  replay?: AnnualMembershipStatistics = new AnnualMembershipStatistics();

  constructor(annualMembershipStatisticsList?: AnnualMembershipStatisticsList) {
    if (annualMembershipStatisticsList) {
      Object.assign(this, { ...annualMembershipStatisticsList });
    }
  }
}
