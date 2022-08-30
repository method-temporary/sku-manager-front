import { LearningState } from './LearningState';
import { ProposalState } from './ProposalState';

export default class StudentByCubeRdo {
  //
  cubeId: string = '';
  offset: number = 0;
  limit: number = 0;
  leaningState: LearningState[] = [];
  proposalState: ProposalState = ProposalState.DEFAULT;
  name: string = '';
  company: string = '';
  department: string = '';
  email: string = '';
  startTime: number = 0;
  endTime: number = 0;
  round: number = 1;

  type: string = '';

  constructor(studentByCubeRdo?: StudentByCubeRdo) {
    if (studentByCubeRdo) {
      Object.assign(this, studentByCubeRdo);
    }
  }
}
