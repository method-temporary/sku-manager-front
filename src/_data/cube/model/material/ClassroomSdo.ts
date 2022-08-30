import { Enrolling } from './Enrolling';
import { FreeOfCharge } from './FreeOfCharge';
import { Operation } from '../Operation';
import { Classroom } from './Classroom';
import { DatePeriod, DEFAULT_DATE_FORMAT } from '../../../shared';
import dayjs from 'dayjs';
import { PatronType } from '@nara.platform/accent';

export interface ClassroomSdo {
  capacity: number;
  capacityClosed: boolean;
  enrolling: Enrolling;
  freeOfCharge: FreeOfCharge;
  operation: Operation;
  round: number;
  waitingCapacity: number;
}

function fromClassroom(classroom: Classroom): ClassroomSdo {
  return {
    ...classroom,
  };
}

function initialize(): ClassroomSdo {
  const now = new Date();

  let startDate = dayjs(now);
  let endDate = startDate.add(1, 'month');

  const applyingPeriod: DatePeriod = {
    // zoneId: null,
    startDate: dayjs(startDate).format(DEFAULT_DATE_FORMAT),
    endDate: dayjs(endDate).format(DEFAULT_DATE_FORMAT),
  };

  const cancellablePeriod: DatePeriod = {
    ...applyingPeriod,
  };

  startDate = dayjs(endDate).add(1, 'day');
  endDate = startDate.add(1, 'month');

  const learningPeriod: DatePeriod = {
    // zoneId: null,
    startDate: dayjs(startDate).format(DEFAULT_DATE_FORMAT),
    endDate: dayjs(endDate).format(DEFAULT_DATE_FORMAT),
  };

  return {
    capacity: 0,
    capacityClosed: false,
    enrolling: {
      applyingPeriod,
      cancellablePeriod,
      learningPeriod,
      cancellationPenalty: '',
      enrollingAvailable: false,
    },
    freeOfCharge: {
      approvalProcess: false,
      chargeAmount: 0,
      freeOfCharge: true,
      sendingMail: false,
    },
    operation: {
      location: '',
      operator: {
        keyString: '',
        patronType: PatronType.Denizen,
      },
      siteUrl: '',
    },
    round: 1,
    waitingCapacity: 0,
  };
}

export const ClassroomSdoFunc = { initialize, fromClassroom };
