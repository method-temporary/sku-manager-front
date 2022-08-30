import { decorate, observable } from 'mobx';

import { LangStrings, QueryModel } from 'shared/model';

import { FormDesignerModel } from './FormDesignerModel';
import { QuestionPathModel } from './QuestionPathModel';
import { CriterionModel } from './CriterionModel';
import { QuestionGroupModel } from './QuestionGroupModel';
import { QuestionModel } from './QuestionModel';
import { SuggestionModel } from './SuggestionModel';
import SurveyFormFlowRdoModel from './SurveyFormFlowRdoModel';

export class SurveyFormQueryModel extends QueryModel {
  //
  titles: LangStrings = new LangStrings();
  managementNumber: string = '';
  formDesigner: FormDesignerModel = new FormDesignerModel();
  description: string = '';
  time: number = 0;
  designState: string = '';
  confirmTime: number = 0;
  supportedLanguages: string[] = [];
  questionPath: QuestionPathModel = new QuestionPathModel();
  criterionList: CriterionModel[] = [];
  questionGroups: QuestionGroupModel[] = [];
  questions: QuestionModel[] = [];
  suggestions: SuggestionModel[] = [];
  currentPage: number = 0;
  finalCopy: boolean = false;

  //UI
  selectedCriterion: CriterionModel = new CriterionModel();

  static asSurveyRdo(surveyFormQuery: SurveyFormQueryModel): SurveyFormFlowRdoModel {
    let isSurveyName = false;
    let isWord = false;
    if (surveyFormQuery.searchPart === '제목') isSurveyName = true;
    if (surveyFormQuery.searchPart === '등록자') isWord = true;
    return {
      startDate: surveyFormQuery && surveyFormQuery.period && surveyFormQuery.period.startDateLong,
      endDate: surveyFormQuery && surveyFormQuery.period && surveyFormQuery.period.endDateLong,
      designState: surveyFormQuery && surveyFormQuery.designState,
      name: (isSurveyName && surveyFormQuery && encodeURIComponent(surveyFormQuery.searchWord)) || '',
      creatorName: (isWord && surveyFormQuery && encodeURIComponent(surveyFormQuery.searchWord)) || '',
      offset: surveyFormQuery && surveyFormQuery.offset,
      limit: surveyFormQuery && surveyFormQuery.limit,
      finalCopy: surveyFormQuery && surveyFormQuery.finalCopy,
    };
  }
}

decorate(SurveyFormQueryModel, {
  titles: observable,
  managementNumber: observable,
  formDesigner: observable,
  description: observable,
  time: observable,
  designState: observable,
  confirmTime: observable,
  supportedLanguages: observable,
  questionPath: observable,
  criterionList: observable,
  questionGroups: observable,
  questions: observable,
  suggestions: observable,
  selectedCriterion: observable,
  currentPage: observable,
  finalCopy: observable,
});
