import { LearningState } from '../../../../lecture/student/model/LearningState';
import { StudentCountType } from './StudentCountType';
import { ProposalState } from '../../../../lecture/student/model/ProposalState';

export default class StudentCountRdo {
  //
  cardId: string = '';
  round: number = 1;
  // studentType:
  learningState: LearningState[] = [];
  proposalState: ProposalState = ProposalState.DEFAULT;

  name: string = '';
  company: string = '';
  department: string = '';
  email: string = '';
  startTime: number = 0;
  endTime: number = 0;
  // surveyStatus:

  type: StudentCountType = StudentCountType.APPROVAL;
}
