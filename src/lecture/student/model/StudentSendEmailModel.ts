import { decorate, observable } from 'mobx';

export class StudentSendEmailModel {
  //
  emails: string[] = [];
  mailContents: string = '';

  constructor(student?: StudentSendEmailModel) {
    //
    if (student) {
      Object.assign(this, { ...student });
    }
  }
}

decorate(StudentSendEmailModel, {
  emails: observable,
  mailContents: observable,
});

export default StudentSendEmailModel;

