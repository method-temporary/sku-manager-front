
import { QuestionAnswer } from "./QuestionAnswer";
import { QuestionItem } from "./QuestionItem";
import { QuestionType } from "./QuestionType";

export interface ExamQuestionModel {
  id: string;
  entityVersion: number;
  paperId: string;
  sequence: number;
  groupName: string;
  mandatory: boolean;
  point: number;
  questionType: QuestionType;
  question: string;
  imagePath: string;
  items: QuestionItem[];
  questionAnswer: QuestionAnswer;
  description: string;
}

export function getChoiceScore(questions: ExamQuestionModel[]) {
  return questions
    .filter(q =>
      q.questionType === 'SingleChoice' ||
      q.questionType === 'MultiChoice')
    .map(q => q.point)
    .reduce((a, b) => a + b, 0);

}

export function getAnswerScore(questions: ExamQuestionModel[]) {
  return questions
    .filter(q =>
      q.questionType === 'ShortAnswer' ||
      q.questionType === 'Essay')
    .map(q => q.point)
    .reduce((a, b) => a + b, 0);
}