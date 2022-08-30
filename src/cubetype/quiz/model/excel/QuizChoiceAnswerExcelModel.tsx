import { QuizCommonAnswerExcelModel } from './QuizCommonAnswerExcelModel';

export interface QuizChoiceAnswerExcelModel extends QuizCommonAnswerExcelModel {
  '선택 답변': string;
  '선택 답변 문항': string;
}
