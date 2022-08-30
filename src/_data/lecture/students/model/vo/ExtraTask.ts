import { ExtraTaskStatus } from './ExtraTaskStatus';

export interface ExtraTask {
  //
  testStatus: ExtraTaskStatus;
  reportStatus: ExtraTaskStatus;
  surveyStatus: ExtraTaskStatus;
  discussionStatus: ExtraTaskStatus;
}
