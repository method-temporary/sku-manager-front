import QuestionItems from './QuestionItems';
import { decorate, observable } from 'mobx';

export class CriterionQuestionItems implements QuestionItems {
  answerType: string = 'Criterion';
  criterionNumber: string = '';

  constructor(answerItemsApiModel?: any) {
    if (answerItemsApiModel) {
      Object.assign(this, answerItemsApiModel);
    }
  }

  getAnswerType() {
    return this.answerType;
  }
}

decorate(CriterionQuestionItems, {
  answerType: observable,
  criterionNumber: observable,
});
