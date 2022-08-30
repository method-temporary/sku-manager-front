import { LearningStateType } from 'lecture/student/model/LearningState';

export interface Target {
  learningState?: LearningStateType;
  reportNotPassed?: boolean;
  surveyNotPassed?: boolean;
  testNotPassed?: boolean;
}
