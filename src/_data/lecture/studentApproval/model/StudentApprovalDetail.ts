import Card from '_data/lecture/cards/model/Card';
import { EnrollmentCard } from '_data/lecture/cards/model/EnrollmentCard';
import { Student } from '_data/lecture/students/model/Student';
import { UserIdentity } from '_data/shared/UserIdentity';
import { StudentApproval } from './StudentApproval';

export interface StudentApprovalDetail {
  card: Card;
  enrollmentCard: EnrollmentCard;
  userIdentity: UserIdentity;
  student: Student;
  studentApproval: StudentApproval;
  approverIdentity: UserIdentity;
}
