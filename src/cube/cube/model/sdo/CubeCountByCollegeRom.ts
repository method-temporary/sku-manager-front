import { decorate, observable } from 'mobx';

export class CubeCountByCollegeRom {
  //
  collegeId: string = '';
  count: number = 0;

  constructor(cubeCountByCollegeRom?: CubeCountByCollegeRom) {
    if (cubeCountByCollegeRom) {
      Object.assign(this, { ...cubeCountByCollegeRom });
    }
  }
}

decorate(CubeCountByCollegeRom, {
  collegeId: observable,
  count: observable,
});
