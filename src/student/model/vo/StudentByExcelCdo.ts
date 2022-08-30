import { StudentCdo } from './StudentCdo';

export class StudentByExcelCdo {
  //
  studentCdo: StudentCdo = new StudentCdo();
  email: string = '';

  constructor(studentByExcelCdo?: StudentByExcelCdo) {
    if (studentByExcelCdo) {
      Object.assign(this, { ...studentByExcelCdo });
    }
  }
}
