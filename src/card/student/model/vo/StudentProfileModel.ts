import { PolyglotModel } from 'shared/model';

export class StudentProfileModel {
  //
  id: string = '';
  company: PolyglotModel = new PolyglotModel();
  department: PolyglotModel = new PolyglotModel();
  email: string = '';
  name?: PolyglotModel = new PolyglotModel();

  constructor(studentProfile?: StudentProfileModel) {
    //
    if (studentProfile) {
      Object.assign(this, { ...studentProfile });
    }
  }
}
