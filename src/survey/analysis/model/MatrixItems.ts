import { decorate, observable } from 'mobx';
import { MatrixSummaryItems } from './MatrixSummaryItems';

export class MatrixItems {
  rowNumber: string = '';
  numberCountMap: Map<string, number> = new Map();

  constructor(items?: any) {
    if (items) {
      Object.assign(this, items);
      this.numberCountMap =
        (items.numberCountMap &&
          new Map(Object.entries(items.numberCountMap))) ||
        new Map<string, number>();
    }
  }

  getItem(item: MatrixItems) {
    //
    
  }
}