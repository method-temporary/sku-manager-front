import { decorate, observable } from 'mobx';
import { AnswerItemType } from '../../answer/model/AnswerItemType';
import AnswerModel from '../../answer/model/AnswerModel';

export class MatrixSummaryItem {
  rowNumber: String = '';
  numberCountMap: Map<string, number> = new Map();


  constructor(items?: any) {
    if (items) {
      Object.assign(this, items);
      this.numberCountMap = items.numberCountMap && new Map(Object.entries(items.numberCountMap)) || new Map<string, number>();
    }
  }
}

decorate(MatrixSummaryItem, {
  rowNumber: observable,
  numberCountMap: observable,
});
