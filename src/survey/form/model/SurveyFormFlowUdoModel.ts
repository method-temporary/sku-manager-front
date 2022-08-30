import { NameValueList } from 'shared/model';
import { QuestionFlowUdoModel } from './QuestionFlowUdoModel';

export interface SurveyFormFlowUdoModel {
  //
  surveyFormNameValues: NameValueList;
  questions: QuestionFlowUdoModel[];
}
