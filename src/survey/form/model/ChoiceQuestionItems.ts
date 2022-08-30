import QuestionItems from './QuestionItems';
import { AnswerImageUrlModel } from './AnswerImageUrlModel';
import { NumberValue } from './NumberValue';

export class ChoiceQuestionItems implements QuestionItems {
  answerType: string = 'Choice';
  multipleChoice: boolean = false;
  items: NumberValue[] = [];
  imageUrls: AnswerImageUrlModel[] = [];

  constructor(answerItemsApiModel?: any) {
    if (answerItemsApiModel) {
      Object.assign(this, answerItemsApiModel);
      this.items = answerItemsApiModel.items.map(
        (item: any) => new NumberValue(item)
      );

      this.imageUrls = answerItemsApiModel.imageUrls.map(
        (item: any) => new AnswerImageUrlModel(item)
      );
    }
  }

  getAnswerType() {
    return this.answerType;
  }
}
