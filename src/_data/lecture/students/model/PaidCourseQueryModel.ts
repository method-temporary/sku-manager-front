import { PaidCourseLearningState } from './PaidCourseLearningState';
import { PaidCourseProposalState } from './PaidCourseProposalState';
import { PaidCourseSortOrder } from './PaidCourseSortOrder';

export interface PaidCourseQueryModel {
  cardName?: string;
  companyCode?: string;
  departmentName?: string;
  email?: string;
  startDate?: number;
  endDate?: number;
  limit: number;
  offset: number;
  paidCourseLearningState?: PaidCourseLearningState;
  proposalState?: PaidCourseProposalState;
  sortOrder: PaidCourseSortOrder;
  studentName?: string;
  employed?: boolean;
}
