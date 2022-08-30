import QuestionItems from './QuestionItems';
import { NumberValue } from './NumberValue';

export class MatrixQuestionItems implements QuestionItems {
  answerType: string = 'Matrix';
  multipleChoice: boolean = false;
  rowItems: NumberValue[] = [];
  columnItems: NumberValue[] = [];

  constructor(answerItemsApiModel?: any) {
    if (answerItemsApiModel) {
      Object.assign(this, answerItemsApiModel);
      this.rowItems = answerItemsApiModel.rowItems.map(
        (item: any) => new NumberValue(item)
      );

      this.columnItems = answerItemsApiModel.columnItems.map(
        (item: any) => new NumberValue(item)
      );
    }
  }

  getAnswerType() {
    return this.answerType;
  }
}
