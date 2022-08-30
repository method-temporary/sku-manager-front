export class BadgeStudentCountRdoModel {
  //
  totalCount: number = 0;
  issuedCount: number = 0;
  canceledCount: number = 0;
  requestedCount: number = 0;
  requestCanceledCount: number = 0;
  challengeCancelCount: number = 0;
  challengingCount: number = 0;
  // requestRejectedCount: number = 0;

  constructor(studentCountRdo: BadgeStudentCountRdoModel) {
    this.totalCount = studentCountRdo.totalCount;
    this.issuedCount = studentCountRdo.issuedCount;
    this.canceledCount = studentCountRdo.canceledCount;
    this.requestedCount = studentCountRdo.requestedCount;
    this.requestCanceledCount = studentCountRdo.requestCanceledCount;
    this.challengeCancelCount = studentCountRdo.challengeCancelCount;
    this.challengingCount = studentCountRdo.challengingCount;

    // this.requestRejectedCount = studentCountRdo.requestRejectedCount;
  }
}
