import { InstructorCube } from './InstructorCube';

export class InstructorCubeList {
  //
  results: InstructorCube[] = [];
  totalCount: number = 0;
  totalLectureTime: number = 0;

  constructor(instructorCubeList?: InstructorCubeList) {
    if (instructorCubeList) {
      Object.assign(this, { ...instructorCubeList });
    }
  }
}
