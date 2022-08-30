import { LearningState } from '../../../lecture/student/model/LearningState';

export class StudentRdoModel {
  //
  // 공통
  cardId: string = '';

  limit: number = 0;
  offset: number = 20;
  startDate: number = 0;
  endDate: number = 0;

  learningState: LearningState = LearningState.Empty;

  name: string = '';
  company: string = '';
  department: string = '';
  email: string = '';

  // 학습자
  childLecture: string = '';

  // 결과관리
  scoringState: string = '';
  numberOfTrials: string = '';
  phaseCompleteState: boolean = false;
}
