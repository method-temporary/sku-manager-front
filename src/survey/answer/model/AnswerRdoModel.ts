import { decorate, observable } from 'mobx';
import { AnswerItemModel } from './AnswerItemModel';

export default class AnswerRdoModel {
  //
  questionNumber: string = '';

  question: string = '';
  answer: string = '';
  answerItem: AnswerItemModel = new AnswerItemModel();

  constructor(answer?: AnswerRdoModel) {
    if (answer) {
      Object.assign(this, answer);
    }
  }
}

decorate(AnswerRdoModel, {
  questionNumber: observable,
  question: observable,
  answer: observable,
});
