import { LearningState } from './vo/LearningState';
import { ProposalState } from './vo/ProposalState';
import { ScoringState } from './vo/ScoringState';
import { ServiceType } from './vo/ServiceType';

export class StudentRdoForTestModel {
  //
  proposalState: ProposalState = ProposalState.Approved;
  learningState: LearningState | null = null;
  scoringState: ScoringState | null = null;
  rollBookId: string = '';
  lectureUsid: string = '';
  name: string = '';
  company: string = '';
  department: string = '';
  email: string = '';
  startTime: number = 0;
  endTime: number = 0;
  limit: number = 0;
  offset: number = 20;
  numberOfTrials: number | null = null;
  phaseCompleteState: string = '';

  stamped: string = '';
  serviceType: ServiceType | null = null;
}
