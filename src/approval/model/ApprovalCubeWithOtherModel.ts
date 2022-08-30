import { ClassroomModel } from '../../cube/classroom/model/ClassroomModel';
import { CubeModel } from '../../cube/cube/model/CubeModel';
import StudentApprovalModel from '../../student/model/StudentApprovalModel';
import { UserIdentityModel } from '../../cube/user/model/UserIdentityModel';
import { StudentModel } from '../../student/model/StudentModel';

export class ApprovalCubeWithOtherModel {
  //
  classroom: ClassroomModel = new ClassroomModel();
  cube: CubeModel = new CubeModel();
  studentApproval: StudentApprovalModel = new StudentApprovalModel();
  userIdentity: UserIdentityModel = new UserIdentityModel();
  student: StudentModel = new StudentModel();

  constructor(approvalCubeWithOtherModel?: ApprovalCubeWithOtherModel) {
    //
    if (approvalCubeWithOtherModel) {
      const classroom = new ClassroomModel(approvalCubeWithOtherModel.classroom);
      const cube = new CubeModel(approvalCubeWithOtherModel.cube);
      const studentApproval = new StudentApprovalModel(approvalCubeWithOtherModel.studentApproval);
      const userIdentity = new UserIdentityModel(approvalCubeWithOtherModel.userIdentity);

      Object.assign(this, {
        classroom,
        cube,
        studentApproval,
        userIdentity,
        student: approvalCubeWithOtherModel.student,
      });
    }
  }
}
