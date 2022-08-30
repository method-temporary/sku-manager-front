import { decorate, observable } from 'mobx';
import SummaryItems from './SummaryItems';
import { MatrixSummaryItem } from './MatrixSummaryItem';
import { AnswerItemType } from '../../answer/model/AnswerItemType';
import AnswerModel from '../../answer/model/AnswerModel';

export class MatrixSummaryItems implements SummaryItems {
  matrixItems: MatrixSummaryItem[] = [];

  constructor(items?: any) {
    if (items) {
      Object.assign(this, items);
    }
  }

  getAnswerType() {
    return AnswerItemType.Matrix;
  }

  addAnswer(answer: AnswerModel) {
    //
  }
}

decorate(MatrixSummaryItems, {
  matrixItems: observable,
});
