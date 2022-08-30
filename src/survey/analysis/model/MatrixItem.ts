import { decorate, observable } from 'mobx';
import { MatrixSummaryItems } from './MatrixSummaryItems';

export class MatrixItem {
  rowNumber: string = '';
  columnSelectedNumber: string = '';

  constructor(items?: any) {
    if (items) {
      Object.assign(this, items);
    }
  }
}

decorate(MatrixItem, {
  rowNumber: observable,
  columnSelectedNumber: observable
});
