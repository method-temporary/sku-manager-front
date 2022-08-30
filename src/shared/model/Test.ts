import { action, decorate, observable } from 'mobx';

export class Test {
  //
  testId: string = '';
  paperId: string = '';
  successPoint: number = 0;
  examTitle: string = '';

  constructor(test?: Test) {
    //
    if (test) {
      Object.assign(this, { ...test });
    }
  }

  @action
  setSuccessPoint(value: number) {
    this.successPoint = value;
  }
}

decorate(Test, {
  testId: observable,
  paperId: observable,
  successPoint: observable,
  examTitle: observable,
});
