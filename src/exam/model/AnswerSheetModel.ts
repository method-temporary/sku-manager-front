import { DenizenKey } from "@nara.platform/accent";
import { AnswerState } from "./AnswerState";
import { ItemAnswer } from "./ItemAnswer";

export interface AnswerSheetModel {
  id: string;
  entityVersion: number;
  denizenId: string;
  lectureId: string;
  paperId: string;
  answers: ItemAnswer[];
  obtainedScore: number;
  finished: boolean;
  answerState: AnswerState;
  grader: DenizenKey;
  graderComment: string;
  trials: number;
  scoreList: number[];
}