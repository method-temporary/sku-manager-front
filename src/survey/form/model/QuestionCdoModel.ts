import { LangString } from '@nara.platform/accent';
import { SequenceModel } from './SequenceModel';
import { QuestionItemType } from './QuestionItemType';

export interface QuestionCdoModel {
  audienceKey: string;
  sequence: SequenceModel,
  sentence: LangString,
  optional: boolean,
  questionItemType: QuestionItemType,
  surveyFormId: string,
}
