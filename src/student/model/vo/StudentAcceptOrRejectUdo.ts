export class StudentAcceptOrRejectUdo {
  //
  studentIds: string[] = [];
  remark: string = '';

  constructor(studentAcceptOrReject?: StudentAcceptOrRejectUdo) {
    //
    if (studentAcceptOrReject) {
      Object.assign(this, { ...studentAcceptOrReject });
    }
  }
}
