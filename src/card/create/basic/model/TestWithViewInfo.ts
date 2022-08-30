import { Test } from '_data/lecture/cards/model/vo';
import { QuestionSelectionType } from '../../../../exam/model/QuestionSelectionType';

export interface TestWithViewInfo extends Test {
  //
  questionSelectionType: QuestionSelectionType;
  totalPoint: number;
}
