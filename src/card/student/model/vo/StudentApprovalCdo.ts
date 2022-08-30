import { decorate, observable } from 'mobx';

export default class StudentApprovalCdo {
  //
  studentId: string = '';
  approvalEmail: string = '';

  constructor(studentApprovalCdo?: StudentApprovalCdo) {
    if (studentApprovalCdo) {
      Object.assign(this, studentApprovalCdo);
    }
  }
}

decorate(StudentApprovalCdo, {
  studentId: observable,
  approvalEmail: observable,
});
