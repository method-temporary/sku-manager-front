import { InstructorWithUserIdentity } from '../../instructor/instructor/model/InstructorWithUserIdentity';
import { decorate, observable } from 'mobx';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

export default class CubeInstructorModel {
  //
  id: string = '';
  usid: string = '';
  instructorId: string = '';
  lectureTime: number = 0;
  instructorLearningTime: number = 0;
  representative: boolean = false;
  round: number = 0;
  internal: boolean = false;

  name: string = '';
  email: string = '';
  department: string = '';
  company: string = '';

  constructor(cubeInstructorModel?: CubeInstructorModel) {
    //
    if (CubeInstructorModel)
      //
      Object.assign(this, { ...cubeInstructorModel });
  }

  static asCubeInstructorByInstructorWiths(
    instructorWiths: InstructorWithUserIdentity,
    cubeInstructorModel?: CubeInstructorModel
  ): CubeInstructorModel {
    //
    const cubeInstructor = cubeInstructorModel ? { ...cubeInstructorModel } : new CubeInstructorModel();

    return {
      ...cubeInstructor,
      ...instructorWiths.instructor,
      name:
        getPolyglotToAnyString(instructorWiths.user.name) || getPolyglotToAnyString(instructorWiths.instructor.name),
      email: instructorWiths.user.email || instructorWiths.instructor.email,
      department:
        getPolyglotToAnyString(instructorWiths.user.departmentName) ||
        getPolyglotToAnyString(instructorWiths.instructor.organization),
      company: getPolyglotToAnyString(instructorWiths.user.companyName),
    };
  }
}

decorate(CubeInstructorModel, {
  id: observable,
  usid: observable,
  instructorId: observable,
  lectureTime: observable,
  instructorLearningTime: observable,
  representative: observable,
  round: observable,
  internal: observable,
  name: observable,
  email: observable,
  department: observable,
  company: observable,
});
