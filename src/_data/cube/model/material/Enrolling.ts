import { DatePeriod } from '../../../shared';

export interface Enrolling {
  applyingPeriod: DatePeriod;
  cancellablePeriod: DatePeriod;
  cancellationPenalty: string;
  enrollingAvailable: boolean;
  learningPeriod: DatePeriod;
}
