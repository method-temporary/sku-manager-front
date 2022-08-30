import { action, decorate, observable } from 'mobx';

export class TestModel {
  testId: string = '';
  paperId: string = '';
  successPoint: number = 0;

  examTitle: string = '';
  examAuthorName: string = '';

  constructor(test?: TestModel) {
    if (test) {
      Object.assign(this, { ...test });
    }
  }

  @action
  testSuccessPointValue(successPoint: number): void {
    this.successPoint = successPoint;
  }
}

decorate(TestModel, {
  testId: observable,
  paperId: observable,
  successPoint: observable,
  examTitle: observable,
  examAuthorName: observable,
});
