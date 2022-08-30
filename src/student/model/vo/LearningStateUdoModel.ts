import { IdName } from 'shared/model';
import { LearningState } from './LearningState';

export class LearningStateUdoModel {
  //
  studentIds: string[] = [];
  actor: IdName = new IdName();
  learningState: LearningState = LearningState.Progress;
  stamped: boolean = false;
}
