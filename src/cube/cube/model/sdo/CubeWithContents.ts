import { CubeModel } from '../CubeModel';
import { CubeContentsModel } from '../CubeContentsModel';
import { decorate, observable } from 'mobx';

export class CubeWithContents {
  //
  cube: CubeModel = new CubeModel();
  cubeContents: CubeContentsModel = new CubeContentsModel();

  constructor(cubeWithContents?: CubeWithContents) {
    if (cubeWithContents) {
      const cube = new CubeModel(cubeWithContents.cube);
      const cubeContents = new CubeContentsModel(cubeWithContents.cubeContents);
      Object.assign(this, { ...cubeWithContents, cube, cubeContents });
    }
  }
}

decorate(CubeWithContents, {
  cube: observable,
  cubeContents: observable,
});
