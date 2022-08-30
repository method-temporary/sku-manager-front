import { AnswerSheetModel } from "./AnswerSheetModel";
import { ExamPaperModel } from "./ExamPaperModel";
import { ExamQuestionModel } from "./ExamQuestionModel";

export interface AnswerSheetDetailModel {
  examPaper: ExamPaperModel;
  examQuestions: ExamQuestionModel[];
  answerSheet: AnswerSheetModel;
}