import QuestionItems from './QuestionItems';

export class DateQuestionItems implements QuestionItems {
  constructor(answerItemsApiModel?: any) {
    if (answerItemsApiModel) {
      Object.assign(this, answerItemsApiModel);
    }
  }

  getAnswerType() {
    return 'Date';
  }
}
