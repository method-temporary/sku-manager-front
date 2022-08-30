import { QuestionAnswer } from 'exam/model/QuestionAnswer';
import { QuestionSelectionTypeText } from 'exam/model/QuestionSelectionType';
import { QuestionType } from 'exam/model/QuestionType';

export interface GradeSheetViewModel {
  id: string;
  testInfo: TestInfo;
  questionSelectionInfo: QuestionSelectionInfo;
  questions: Question[];
  obtainedScore: ObtainedScore;
  essayScores: EssayScore[];
  graderComment: string;
}

export interface TestInfo {
  title: string;
  authorName: string;
  description: string;
}

export interface QuestionSelectionInfo {
  questionSelectionTypeText: QuestionSelectionTypeText;
  questionCount: number;
  successPoint: number;
  totalPoint: number;
  choiceScore: number;
  answerScore: number;
}

export interface ObtainedScore {
  choiceScore: number;
  shortAnswerScore: number;
  essayScore: number;
}

export interface Question {
  sequence: number;
  mandatory: boolean;
  groupName: string;
  questionType: QuestionType;
  point: string;
  question: string;
  items: QuestionItem[];
  imagePath: string;
  questionAnswer: QuestionAnswer;
  examineeAnswer: string;
  isCorrect: boolean;
}

export interface QuestionItem {
  itemNo: string;
  itemText: string;
  imgSrc: string;
}

export interface EssayScore {
  questionNo: number;
  score: number;
  allocatedPoint: number;
}

export function hasEssayQuestion(questions: Question[]): boolean {
  const maybeEssay = questions.find((question) => question.questionType === 'Essay');
  return maybeEssay !== undefined;
}
