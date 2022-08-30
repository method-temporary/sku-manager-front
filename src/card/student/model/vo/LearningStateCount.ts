export class LearningStateCount {
  //
  resultWaitingCount: number = 0;

  progressCount: number = 0;
  waitingCount: number = 0;
  testWaitingCount: number = 0;
  homeworkWaitingCount: number = 0;
  failedCount: number = 0;
  testPassedCount: number = 0;

  passedCount: number = 0;
  missedCount: number = 0;
  noShowCount: number = 0;

  constructor(learningStateCount?: LearningStateCount) {
    if (learningStateCount) {
      Object.assign(this, { ...learningStateCount });
    }
  }
}
