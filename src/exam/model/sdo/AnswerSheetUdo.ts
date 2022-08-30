import { EssayScore } from "./GradeSheetUdo";

export interface AnswerSheetUdo {
  studentDenizenId: string;
  lectureId: string;
  essayScores: EssayScore[];
  graderComment: string;
}