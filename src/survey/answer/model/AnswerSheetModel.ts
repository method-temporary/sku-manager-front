import { decorate, observable } from 'mobx';
import { NameValueList } from '@nara.platform/accent';

import SuggestionSheetModel from './SuggestionSheetModel';
import RespondentModel from './RespondentModel';
import { AnswerProgress } from './AnswerProgress';
import EvaluationSheetModel from './EvaluationSheetModel';
import { DramaEntityObservableModel } from 'shared/model';

export default class AnswerSheetModel extends DramaEntityObservableModel {
  //
  surveyCaseId: string = '';
  round: number = 1;
  managementNumber: string = '';
  progress: AnswerProgress = AnswerProgress.Open;
  respondent: RespondentModel = new RespondentModel();
  suggestionSheet: SuggestionSheetModel = new SuggestionSheetModel();
  completeTime: number = 0;

  evaluationSheet: EvaluationSheetModel = new EvaluationSheetModel();

  constructor(answerSheet?: AnswerSheetModel) {
    super();
    if (answerSheet) {
      Object.assign(this, answerSheet);
      this.respondent = (answerSheet.respondent && new RespondentModel(answerSheet.respondent)) || this.respondent;
      this.suggestionSheet =
        (answerSheet.suggestionSheet && new SuggestionSheetModel(answerSheet.suggestionSheet)) || this.suggestionSheet;
      this.evaluationSheet =
        (answerSheet.evaluationSheet && new EvaluationSheetModel(answerSheet.evaluationSheet)) || this.evaluationSheet;
    }
  }

  static getNameValueList(answerSheet: AnswerSheetModel) {
    const nameValues = [];
    nameValues.push({ name: 'respondent', value: JSON.stringify(answerSheet.respondent) });
    nameValues.push({ name: 'suggestionSheet', value: JSON.stringify(answerSheet.suggestionSheet) });

    return { nameValues } as NameValueList;
  }
}

decorate(AnswerSheetModel, {
  respondent: observable,
  suggestionSheet: observable,
  evaluationSheet: observable,
  managementNumber: observable,
  progress: observable,
  completeTime: observable,
});
