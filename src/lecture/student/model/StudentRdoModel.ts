import { ProposalState } from './ProposalState';
import { ServiceType } from './ServiceType';
import { LearningState } from './LearningState';

export class StudentRdoModel {
  //
  proposalState: ProposalState = ProposalState.Approved;
  learningState: LearningState | null = null;
  applyNotLearningState: string = '';
  rollBookId: string = '';
  name: string = '';
  company: string = '';
  department: string = '';
  email: string = '';
  round: number = 0;
  startTime: number = 0;
  endTime: number = 0;
  limit: number = 0;
  offset: number = 20;
  phaseCompleteState: string = '';

  stamped: string = '';
  lectureUsid: string = '';
  serviceType: ServiceType | null = null;
  surveyAnswered: string = '';
  surveyCaseId: string = '';
}
