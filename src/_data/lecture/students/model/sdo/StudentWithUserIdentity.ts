import { Student } from '../Student';
import { SimpleUserIdentity } from '../../../../shared/SimpleUserIdentity';

export interface StudentWithUserIdentity {
  //
  student: Student;
  userIdentity?: SimpleUserIdentity;
  passedNumber: string;
}
