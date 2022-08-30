import { SimpleUserIdentity } from '_data/shared/SimpleUserIdentity';
import { AssessmentResult } from './AssessmentResult';

export interface AssessmentResultRdo {
  assessmentResult: AssessmentResult;
  userIdentity: SimpleUserIdentity;
}
