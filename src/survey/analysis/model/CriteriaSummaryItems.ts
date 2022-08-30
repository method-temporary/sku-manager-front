import { decorate, observable } from 'mobx';
import SummaryItems from './SummaryItems';
import { AnswerItemType } from '../../answer/model/AnswerItemType';
import AnswerModel from '../../answer/model/AnswerModel';
import { CriteriaItemModel } from '../../form/model/CriteriaItemModel';

export class CriteriaSummaryItems implements SummaryItems {

  criteriaItems: CriteriaItemModel[] = [];
  criteriaItemCountMap: Map<string, number> = new Map();

  constructor(items?: any) {
    if (items) {
      Object.assign(this, items);
      this.criteriaItems = items.criteriaItems && items.criteriaItems.length
      && items.criteriaItems.map((criteriaItem: any) => new CriteriaItemModel(criteriaItem)) || [];
      this.criteriaItemCountMap = items.criteriaItemCountMap && new Map(Object.entries(items.criteriaItemCountMap))
        || new Map<string, number>();
    }
  }

  getAnswerType() {
    return AnswerItemType.Criterion;
  }

  addAnswer(answer: AnswerModel) {
    //
    const criteriaItem: CriteriaItemModel = answer.answerItem.criteriaItem;
    let count: number = this.criteriaItemCountMap.get(`${criteriaItem.index}`) || 0;
    this.criteriaItemCountMap.set(`${criteriaItem.index}`, ++count);
  }
}
decorate(CriteriaSummaryItems, {
  criteriaItems: observable,
  criteriaItemCountMap: observable,
});
