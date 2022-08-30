import { QuestionType } from "exam/model/QuestionType";

export interface GradeSheet {
  id: string;
  examId: string;
  examineeId: string;
  examineeEmail: string;
  examineeName: string;
  graderId: string;
  graderName: string;
  graderComment: string;
  obtainedScore: number;
  questionCount: number;
  finished: boolean;
  grades: ItemGrade[];
}

export interface ItemGrade {
  questionNo: number;
  questionType: QuestionType;
  examineeAnswer: string;
  correctAnswer: string;
  allocatedPoint: number;
  obtainedPoint: number;
  comment: string;
}
