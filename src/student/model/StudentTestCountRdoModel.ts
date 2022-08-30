export class StudentTestCountRdoModel {
  //
  totalCount: number = 0;
  progressCount: number = 0;
  waitingCount: number = 0;
  passedCount: number = 0;
  missedCount: number = 0;
  noShowCount: number = 0;

  constructor(studentTestCountRdoModel: StudentTestCountRdoModel) {
    //
    this.totalCount = studentTestCountRdoModel.totalCount;
    this.progressCount = studentTestCountRdoModel.progressCount;
    this.waitingCount = studentTestCountRdoModel.waitingCount;
    this.passedCount = studentTestCountRdoModel.passedCount;
    this.missedCount = studentTestCountRdoModel.missedCount;
    this.noShowCount = studentTestCountRdoModel.noShowCount;
  }
}
