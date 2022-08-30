export default class WaitingCount {
  //
  homeworkWaitingCount: number = 0;
  testWaitingCount: number = 0;
  approvalWaitingCount: number = 0;
  resultWaitingCount: number = 0;

  constructor(waitingCount?: WaitingCount) {
    //
    if (waitingCount) {
      Object.assign(this, { ...waitingCount });
    }
  }
}
