import { ProposalState } from '../../../shared/ProposalState';
import { LearningState } from '../../../shared/LearningState';
import { StudentScore } from './vo/StudentScore';
import { StudentType } from './vo/StudentType';
import { EnrolledState } from './vo/EnrolledState';
import { ExtraTask } from './vo/ExtraTask';

export interface Student {
  //
  id: string;

  name: string;
  proposalState: ProposalState;
  learningState: LearningState;
  isFinishMedia: boolean;
  studentScore: StudentScore;
  registeredTime: number;
  modifiedTime: number;

  cardId: string; //StudentType이 Cube이면서 Cube가 속한 CardID(최초 학습을 시작한 CardID)
  lectureId: string; //cube id or card id
  complete: boolean; // markComplete-true: Video,Audio,WebPage,Doc
  round: number;
  examAttendance: boolean;
  passedYear: number;
  passedTime: number;
  homeworkFileBoxId: string;
  sumViewSeconds: string;
  durationViewSeconds: string;

  studentType: StudentType;
  phaseCount: number; // Course 일 경우 조회시 산출됨. 저장되지 않음.
  completePhaseCount: number; //

  enrolledState: EnrolledState;

  homeworkContent: string;
  homeworkOperatorComment: string;
  homeworkOperatorFileBoxId: string;
  hideYn: boolean;

  extraWork: ExtraTask;
  patronkeyMigTime: number;
}
