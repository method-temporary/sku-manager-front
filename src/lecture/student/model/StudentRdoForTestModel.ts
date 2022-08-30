import { LearningState } from './LearningState';
import { ProposalState } from './ProposalState';
import { ScoringState } from './ScoringState';
import { ServiceType } from './ServiceType';

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
