import { LearningState } from './LearningState';

export class StudentLearningStateUdo {
  //
  studentIds: string[] = [];
  learningState: LearningState = LearningState.Empty;

  static fromStudentInfo(studentIds: string[], learningState: LearningState): StudentLearningStateUdo {
    //
    return {
      studentIds,
      learningState,
    };
  }
}
