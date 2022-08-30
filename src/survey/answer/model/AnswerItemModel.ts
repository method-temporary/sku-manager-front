import { AnswerItemType } from './AnswerItemType';
import { CriteriaItemModel } from '../../form/model/CriteriaItemModel';
import { MatrixItem } from '../../analysis/model/MatrixItem';

export class AnswerItemModel {
  //
  answerItemType: AnswerItemType = AnswerItemType.Choice;
  itemNumbers: string[] = [];
  criteriaItem: CriteriaItemModel = new CriteriaItemModel();
  matrixItem: MatrixItem[] = [];
  sentence: string = '';

  constructor(answerItem?: AnswerItemModel) {
    if (answerItem) {
      Object.assign(this, answerItem);
      switch (answerItem.answerItemType) {
        case 'Criterion':
          this.criteriaItem = new CriteriaItemModel(answerItem.criteriaItem);
          break;
        case 'Matrix':
          this.matrixItem = answerItem.matrixItem && answerItem.matrixItem.length
          && answerItem.matrixItem.map((matrixItem: any) => new MatrixItem(matrixItem)) || [];          
      }
    }
  }

  containsAnswer(number: string) {
    return !!this.itemNumbers.find((itemNumber) => itemNumber === number);
  }
}
