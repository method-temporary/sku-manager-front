import { decorate, observable } from 'mobx';

export class CubeReactiveModelModel {
  //
  passedStudentCount: number = 0;
  studentCount: number = 0;
  starCount: number = 0;
  usingCardCount: number = 0;

  constructor(cubeRelatedCount?: CubeReactiveModelModel) {
    if (cubeRelatedCount) {
      Object.assign(this, { ...cubeRelatedCount });
    }
  }
}

decorate(CubeReactiveModelModel, {
  passedStudentCount: observable,
  studentCount: observable,
  starCount: observable,
  usingCardCount: observable,
});
