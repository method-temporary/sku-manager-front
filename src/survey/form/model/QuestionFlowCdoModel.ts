import { LangStrings } from 'shared/model';

import { SequenceModel } from './SequenceModel';
import { QuestionItemType } from './QuestionItemType';

export interface QuestionFlowCdoModel {
  //
  sequence: SequenceModel;
  sentences: LangStrings;
  optional: boolean;
  visible: boolean;
  questionItemType: QuestionItemType;
  answerItemsJson: string;
  sentencesImageUrl: string;
}
