import { decorate, observable } from 'mobx';

export class NextQuestionModel {
  questionNumber: string = '';
  selectedNumber: string = '';
  nextQuestionNumber: string = '';

  constructor(nextQuestion?: NextQuestionModel) {
    //
    if (nextQuestion) {
      Object.assign(this, { ...nextQuestion });
    }
  }
}

decorate(NextQuestionModel, {
  questionNumber: observable,
  selectedNumber: observable,
  nextQuestionNumber: observable,
});
