import { decorate, observable } from 'mobx';

import { DramaEntityObservableModel } from 'shared/model';
import { AnswerItemType } from '../../answer/model/AnswerItemType';
import SummaryItems from './SummaryItems';
import { ChoiceSummaryItems } from './ChoiceSummaryItems';
import { CriteriaSummaryItems } from './CriteriaSummaryItems';
import { EssaySummaryItems } from './EssaySummaryItems';
import { DateSummaryItems } from './DateSummaryItems';
import { BooleanSummaryItems } from './BooleanSummaryItems';
import { MatrixSummaryItems } from './MatrixSummaryItems';
import { ReviewSummaryItems } from './ReviewSummaryItems';

export default class AnswerSummaryModel extends DramaEntityObservableModel {
  //
  questionNumber: string = '';
  answerItemType: AnswerItemType = AnswerItemType.Choice;
  summaryItems: SummaryItems = new ChoiceSummaryItems();
  surveySummaryId: string = '';

  constructor(summary?: AnswerSummaryModel) {
    //
    super();
    if (summary) {
      Object.assign(this, summary);
      switch (this.answerItemType) {
        case AnswerItemType.Criterion:
          this.summaryItems = new CriteriaSummaryItems(summary.summaryItems);
          break;
        case AnswerItemType.Choice:
        case AnswerItemType.ChoiceFixed:
          this.summaryItems = new ChoiceSummaryItems(summary.summaryItems);
          break;
        case AnswerItemType.Essay:
          this.summaryItems = new EssaySummaryItems(summary.summaryItems);
          break;
        case AnswerItemType.Date:
          this.summaryItems = new DateSummaryItems(summary.summaryItems);
          break;
        case AnswerItemType.Boolean:
          this.summaryItems = new BooleanSummaryItems(summary.summaryItems);
          break;
        case AnswerItemType.Matrix:
          this.summaryItems = new MatrixSummaryItems(summary.summaryItems);
          break;
        case AnswerItemType.Review:
          this.summaryItems = new ReviewSummaryItems(summary.summaryItems);
          break;
      }
    }
  }
}

decorate(AnswerSummaryModel, {
  questionNumber: observable,
  answerItemType: observable,
  summaryItems: observable,
  surveySummaryId: observable,
});
