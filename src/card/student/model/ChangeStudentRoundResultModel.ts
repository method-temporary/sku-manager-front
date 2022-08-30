import { Student } from '_data/lecture/students/model/Student';

export class ChangeStudentRoundResultModel {
  //
  studentId: string = '';
  name: string = '';
  isSuccess: boolean = false;
  errorMessage: string = '';

  constructor(changeStudentRoundResult?: ChangeStudentRoundResultModel) {
    //
    if (changeStudentRoundResult) {
      Object.assign(this, { ...changeStudentRoundResult });
    }
  }

  static asChangeStudentRoundResultModel(success: boolean, student: Student, errMsg: string) {
    //
    return new ChangeStudentRoundResultModel({
      studentId: student.id,
      name: student.name,
      isSuccess: success,
      errorMessage: errMsg,
    });
  }
}
