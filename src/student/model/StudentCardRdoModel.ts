import { SortFilterState } from 'shared/model';
import { LearningState } from './vo/LearningState';
import { ScoringState } from './vo/ScoringState';
import { ExtraTaskStatus } from './vo/ExtraTaskStatus';
import { ExtraTaskType } from './vo/ExtraTaskType';

export class StudentCardRdoModel {
  //
  // 공통
  cardId: string = '';

  limit: number = 0;
  offset: number = 20;
  startTime: number = 0;
  endTime: number = 0;

  learningState: LearningState[] | LearningState = LearningState.Empty;
  proposalState: string = '';

  name: string = '';
  company: string = '';
  department: string = '';
  email: string = '';

  // 학습자
  childLecture: string = '';

  // 결과관리
  scoringState: ScoringState | null = null; // 채점상태
  numberOfTrials: number | null = null; // 응시횟수
  phaseCompleteState: boolean = false;

  extraTaskTypes: ExtraTaskType[] = [];
  extraTaskStatuses: ExtraTaskStatus[] = [];

  type: string = '';

  studentOrderBy: SortFilterState = SortFilterState.RegisteredTimeDesc;
}
