import { decorate, observable } from 'mobx';

export class LearningTimeModel {
  learningMinutes : number=0;
  totalHours : number=0;

  constructor(learningTime? : LearningTimeModel) {
    if (learningTime) {
      Object.assign(this, { ...learningTime });
    }
  }

}

decorate(LearningTimeModel, {
  learningMinutes: observable,
  totalHours: observable,
});
