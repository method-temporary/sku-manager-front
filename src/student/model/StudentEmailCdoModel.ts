import { decorate, observable } from 'mobx';

export class StudentEmailCdoModel {
  //
  cardId: string = '';
  email: string = '';

  constructor(student?: StudentEmailCdoModel) {
    //
    if (student) {
      Object.assign(this, { ...student });
    }
  }
}

decorate(StudentEmailCdoModel, {
  cardId: observable,
  email: observable,
});

export default StudentEmailCdoModel;
