import { StudentModel } from './StudentModel';
import { UserIdentityModel } from '../../cube/user/model/UserIdentityModel';

export class StudentWithUserIdentity {
  //
  passedNumber: number = 0;
  student: StudentModel = new StudentModel();
  userIdentity: UserIdentityModel = new UserIdentityModel();

  constructor(studentWithUserIdentity?: StudentWithUserIdentity) {
    if (studentWithUserIdentity) {
      const student = new StudentModel(studentWithUserIdentity.student);
      const userIdentity = new UserIdentityModel(studentWithUserIdentity.userIdentity);
      Object.assign(this, { ...studentWithUserIdentity, student, userIdentity });
    }
  }
}
