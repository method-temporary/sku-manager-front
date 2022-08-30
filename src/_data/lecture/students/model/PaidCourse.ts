import { LearningStateType } from 'lecture/student/model/LearningState';
import PolyglotString from 'shared/model/PolyglotString';
import { PaidCourseProposalState } from './PaidCourseProposalState';

export interface PaidCourse {
  approvedStudentCount: number;
  capacity: number;
  cardId: string;
  cardName: PolyglotString;
  chargeAmount: number;
  companyCode: string;
  companyName: PolyglotString;
  departmentName: PolyglotString;
  email: string;
  learningEndDate: string;
  learningStartDate: string;
  learningState: LearningStateType;
  proposalState: PaidCourseProposalState;
  registeredTime: number;
  round: number;
  studentId: string;
  studentName: PolyglotString;
  denizenId: string;
}
