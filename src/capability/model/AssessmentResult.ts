import { AssessmentResultStatus } from './AssessmentResultStatus';

export interface AssessmentResult {
  assessmentId: string;
  denizenId: string;
  status: AssessmentResultStatus;
  level: string;
  registeredTime: number;
  completedTime: number;
}
