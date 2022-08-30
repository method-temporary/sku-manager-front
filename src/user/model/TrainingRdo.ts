import { LearningState } from 'student/model/vo/LearningState';
import { ServiceType } from 'student/model/vo/ServiceType';

export class TrainingRdo {
  //
  startDate: number = 0;
  endDate: number = 0;

  startTime: number = 0;
  endTime: number = 0;

  name: string = '';
  userDenizenId: string = '';
  learningState: LearningState[] | LearningState = LearningState.Empty; // 이수상태
  collegeId: string = '';
  channelId: string = '';
  studentType: ServiceType = ServiceType.Empty;

  offset: number = 0;
  limit: number = 20;

  type: string = 'LEARNING_STATE';
  learningStudentOnly: boolean = true;
}
