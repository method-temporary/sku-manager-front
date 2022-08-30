import { decorate, observable } from 'mobx';

export default class RespondentCountModel {
  //
  targetCount: number = 0;
  respondentCount: number = 0;

  constructor(respondentCount?: RespondentCountModel) {
    if (respondentCount) {
      Object.assign(this, respondentCount);
    }
  }
}

decorate(RespondentCountModel, {
  targetCount: observable,
  respondentCount: observable,
});

