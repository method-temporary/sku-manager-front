import { SortFilterState } from 'shared/model';
import { LearningState } from './vo/LearningState';
import { ExtraTaskType } from './vo/ExtraTaskType';
import { ExtraTaskStatus } from './vo/ExtraTaskStatus';
import { ProposalState } from './vo/ProposalState';

export default class StudentByCubeRdo {
  //
  cubeId: string = '';
  offset: number = 0;
  limit: number = 0;
  learningState: LearningState[] = [];
  proposalState: ProposalState = ProposalState.Approved;
  name: string = '';
  company: string = '';
  department: string = '';
  email: string = '';
  startTime: number = 0;
  endTime: number = 0;
  round: number = 1;

  extraTaskTypes: ExtraTaskType[] = [];
  extraTaskStatuses: ExtraTaskStatus[] = [];

  examAttendance: boolean | undefined = undefined;

  studentOrderBy: SortFilterState = SortFilterState.RegisteredTimeDesc;

  constructor(studentByCubeRdo?: StudentByCubeRdo) {
    if (studentByCubeRdo) {
      Object.assign(this, studentByCubeRdo);
    }
  }
}
