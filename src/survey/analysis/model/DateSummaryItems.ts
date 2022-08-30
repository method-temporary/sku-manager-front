import { decorate, observable } from 'mobx';
import SummaryItems from './SummaryItems';
import { AnswerItemType } from '../../answer/model/AnswerItemType';
import AnswerModel from '../../answer/model/AnswerModel';

export class DateSummaryItems implements SummaryItems {
  //
  sentencesMap: Map<string, number> = new Map();

  constructor(items?: any) {
    if (items) {
      Object.assign(this, items);
      //this.sentencesMap = items.sentencesMap && new Map(Object.entries(items.sentencesMap)) || new Map<string, number>();
    }
  }

  getAnswerType() {
    return AnswerItemType.Date;
  }

  addAnswer(answer: AnswerModel) {
    //
    //this.sentences.push(answer.answerItem.sentence);
  }
}
decorate(DateSummaryItems, {
  sentencesMap: observable,
});
