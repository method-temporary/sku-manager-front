
export class StudentCountRdoModel {
  //
  totalCount: number = 0;
  submittedCount: number = 0;
  canceledCount: number = 0;
  approvedCount: number = 0;
  rejectedCount: number = 0;

  stampedCount: number = 0;
  unstampedCount: number = 0;

  constructor(studentCountRdo: StudentCountRdoModel) {
    this.totalCount = studentCountRdo.totalCount;
    this.submittedCount = studentCountRdo.submittedCount;
    this.canceledCount = studentCountRdo.canceledCount;
    this.approvedCount = studentCountRdo.approvedCount;
    this.rejectedCount = studentCountRdo.rejectedCount;
    this.stampedCount = studentCountRdo.stampedCount;
    this.unstampedCount = studentCountRdo.unstampedCount;
  }
}
