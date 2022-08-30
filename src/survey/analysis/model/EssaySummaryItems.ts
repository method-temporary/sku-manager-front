import { decorate, observable } from 'mobx';
import SummaryItems from './SummaryItems';
import { AnswerItemType } from '../../answer/model/AnswerItemType';
import AnswerModel from '../../answer/model/AnswerModel';

export class EssaySummaryItems implements SummaryItems {
  //
  sentences: string[] = [];

  constructor(items?: any) {
    if (items) {
      Object.assign(this, items);
    }
  }

  getAnswerType() {
    return AnswerItemType.Essay;
  }

  addAnswer(answer: AnswerModel) {
    //
    this.sentences.push(answer.answerItem.sentence);
  }
}
decorate(EssaySummaryItems, {
  sentences: observable,
});
