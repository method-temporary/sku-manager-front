import { decorate, observable } from 'mobx';
import { AnswerItemModel } from './AnswerItemModel';
import { AnswerItemType } from './AnswerItemType';

export default class AnswerModel {
  //
  questionNumber: string = '';
  answerItem: AnswerItemModel = new AnswerItemModel();
  answerItemType: AnswerItemType = AnswerItemType.Choice;

  constructor(answer?: AnswerModel) {
    if (answer) {
      Object.assign(this, answer);
      this.answerItem = new AnswerItemModel(answer.answerItem);
    }
  }
}

decorate(AnswerModel, {
  questionNumber: observable,
  answerItem: observable,
  answerItemType: observable,
});
