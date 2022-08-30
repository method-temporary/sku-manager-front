import { decorate, observable } from 'mobx';
import { NextQuestionModel } from './NextQuestionModel';

export class QuestionPathModel {
  //
  nextQuestions: NextQuestionModel[] = [];

  constructor(questionPath?: QuestionPathModel) {
    if (questionPath) {
      Object.assign(this, { ...questionPath });
    }
  }
}

decorate(QuestionPathModel, {
  nextQuestions: observable,
});
