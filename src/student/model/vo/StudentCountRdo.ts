import { LearningState } from './LearningState';
import { StudentCountType } from './StudentCountType';

export default class StudentCountRdo {
  //
  cardId: string = '';
  round?: number = 0;
  learningState: LearningState = LearningState.Empty;
  type: StudentCountType = StudentCountType.APPROVAL;
  employed: string | ''=''; // 재직여부
}
