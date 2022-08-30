import { decorate, observable } from 'mobx';
import { NewDatePeriod } from 'shared/model';

export class Enrolling {
  //
  applyingPeriod: NewDatePeriod = new NewDatePeriod();
  cancellablePeriod: NewDatePeriod = new NewDatePeriod();
  cancellationPenalty: string = '';
  learningPeriod: NewDatePeriod = new NewDatePeriod();
  enrollingAvailable: boolean = false;

  constructor(enrolling?: Enrolling) {
    //
    if (enrolling) {
      const applyingPeriod: NewDatePeriod = new NewDatePeriod(enrolling.applyingPeriod);
      const cancellablePeriod: NewDatePeriod = new NewDatePeriod(enrolling.cancellablePeriod);
      const learningPeriod: NewDatePeriod = new NewDatePeriod(enrolling.learningPeriod);
      Object.assign(this, { ...enrolling, applyingPeriod, cancellablePeriod, learningPeriod });
    }
  }
}

decorate(Enrolling, {
  applyingPeriod: observable,
  cancellablePeriod: observable,
  cancellationPenalty: observable,
  learningPeriod: observable,
  enrollingAvailable: observable,
});
