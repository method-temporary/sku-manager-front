import { InstructorModel } from '../index';
import { UserIdentityModel } from 'cube/user/model/UserIdentityModel';
import CubeInstructorModel from 'cube/cube/CubeInstructorModel';
import { decorate, observable } from 'mobx';
import InvitationModel from '../../../user/model/InvitationModel';

export class InstructorWithUserIdentity {
  //
  instructor: InstructorModel = new InstructorModel();
  user: UserIdentityModel = new UserIdentityModel();
  invitation: InvitationModel = new InvitationModel();

  selected: boolean = false;

  constructor(instructorWithUserIdentity?: InstructorWithUserIdentity) {
    //
    if (instructorWithUserIdentity) {
      //
      const { instructor, user } = instructorWithUserIdentity;

      const newInstructor = new InstructorModel(instructor);
      const newUserIdentity = new UserIdentityModel(user);
      const invitation = new InvitationModel(instructorWithUserIdentity.invitation);

      Object.assign(this, { instructor: newInstructor, user: newUserIdentity, invitation });
    }
  }

  static asInstructorWithUserIdentityByCubeInstructor(
    cubeInstructorModel: CubeInstructorModel
  ): InstructorWithUserIdentity {
    //
    const instructorWiths = new InstructorWithUserIdentity();
    instructorWiths.instructor.id = cubeInstructorModel.id;

    return instructorWiths;
  }
}

decorate(InstructorWithUserIdentity, {
  selected: observable,
});
