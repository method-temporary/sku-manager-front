import { decorate, observable } from 'mobx';
import SummaryItems from './SummaryItems';
import { AnswerItemType } from '../../answer/model/AnswerItemType';
import AnswerModel from '../../answer/model/AnswerModel';

export class ReviewSummaryItems implements SummaryItems {
  numberCountMap: Map<string, number> = new Map();
  sentences: string[] = [];

  constructor(items?: any) {
    if (items) {
      Object.assign(this, items);
      this.numberCountMap =
        (items.numberCountMap && new Map(Object.entries(items.numberCountMap))) || new Map<string, number>();
    }
  }

  getAnswerType() {
    return AnswerItemType.Review;
  }

  addAnswer(answer: AnswerModel) {
    //
    const itemNumbers: string[] = answer.answerItem.itemNumbers;
    itemNumbers.map((itemNumber) => {
      let count: number = this.numberCountMap.get(itemNumber) || 0;
      this.numberCountMap.set(itemNumber, ++count);
    });
  }
}

decorate(ReviewSummaryItems, {
  numberCountMap: observable,
  sentences: observable,
});
