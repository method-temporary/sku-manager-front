import QuestionItems from './QuestionItems';

export class BooleanQuestionItems implements QuestionItems {
  constructor(answerItemsApiModel?: any) {
    if (answerItemsApiModel) {
      Object.assign(this, answerItemsApiModel);
    }
  }

  getAnswerType() {
    return 'Boolean';
  }
}
