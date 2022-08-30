export class StudentProfileModel {
  //
  id: string = '';
  company: string = '';
  department: string = '';
  email: string = '';

  constructor(studentProfile?: StudentProfileModel) {
    //
    if (studentProfile) {
      Object.assign(this, { ...studentProfile });
    }
  }
}
