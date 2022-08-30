export interface GradeSheetUdo {
  essayScores: EssayScore[];
  graderComment: string;
  finished: boolean;
}

export interface EssayScore {
  questionNo: number;
  score: number;
}
