import { LearningState } from './LearningState';

export class StudentCardRdoModel {
  //
  cardId: string = '';
  startDate: number = 0;
  endDate: number = 0;
  name: string = '';
  email: string = '';
  company: string = '';
  department: string = '';

  childLecture: string = '';
  learningState: LearningState = LearningState.Empty;

  offset: number = 0;
  limit: number = 20;
}
