import { ProposalState } from './vo/ProposalState';
import { ServiceType } from './vo/ServiceType';
import { LearningState } from './vo/LearningState';

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
