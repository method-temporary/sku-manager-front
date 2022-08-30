import { EnrollmentCard } from '../../../../_data/lecture/cards/model/EnrollmentCard';
import { DatePeriodFunc, DEFAULT_DATE_FORMAT } from '../../../../_data/shared';
import dayjs from 'dayjs';

export interface EnrollmentCardWithOptional extends EnrollmentCard {
  //
  isApprovalRound: boolean;
}

export function getInitEnrollmentCardWithOptional() {
  //
  return {
    round: 1,
    capacity: 0,
    chargeAmount: 0,

    applyingPeriod: DatePeriodFunc.initialize(),
    cancellablePeriod: DatePeriodFunc.initialize(),
    learningPeriod: {
      startDate: dayjs().add(1, 'M').add(1, 'd').format(DEFAULT_DATE_FORMAT),
      endDate: dayjs().add(2, 'M').add(1, 'd').format(DEFAULT_DATE_FORMAT),
    },

    isApprovalRound: false,
  };
}
