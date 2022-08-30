import { ClassroomSdo } from '../../../cube/model/material';
import { DatePeriod, DatePeriodFunc, DEFAULT_DATE_FORMAT } from '../../../shared';
import dayjs from 'dayjs';

export interface EnrollmentCard {
  //
  round: number;
  capacity: number;
  chargeAmount: number;

  applyingPeriod: DatePeriod;
  cancellablePeriod: DatePeriod;
  learningPeriod: DatePeriod;
}

export function getInitEnrollmentCard() {
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
  };
}

function fromClassroom(classroom: ClassroomSdo, round?: number): EnrollmentCard {
  const toDate = dayjs(new Date());

  return {
    applyingPeriod:
      (classroom.enrolling && { ...classroom.enrolling.applyingPeriod }) ||
      DatePeriodFunc.setDatePeriod(toDate.toDate().getTime(), toDate.add(1, 'month').toDate().getTime()),
    cancellablePeriod:
      (classroom.enrolling && { ...classroom.enrolling.cancellablePeriod }) ||
      DatePeriodFunc.setDatePeriod(toDate.toDate().getTime(), toDate.add(1, 'month').toDate().getTime()),
    learningPeriod:
      (classroom.enrolling && { ...classroom.enrolling.learningPeriod }) ||
      DatePeriodFunc.setDatePeriod(
        toDate.add(1, 'month').add(1, 'day').toDate().getTime(),
        toDate.add(2, 'month').add(1, 'day').toDate().getTime()
      ),
    capacity: classroom.capacity || 0,
    round: round || 1,
    chargeAmount: (classroom.freeOfCharge && classroom.freeOfCharge.chargeAmount) || 0,
  };
}

export const EnrollmentCardFunc = { fromClassroom };
