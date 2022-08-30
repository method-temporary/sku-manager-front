import { CubeModel } from '../CubeModel';
import { CubeContentsModel } from '../CubeContentsModel';
import { CubeReactiveModelModel } from '../CubeReactiveModelModel';
import { CubeMaterial } from '../vo/CubeMaterial';
import { decorate, observable } from 'mobx';
import { UserCubeModel } from '../UserCubeModel';

export class CubeDetail {
  //
  cube: CubeModel = new CubeModel();
  cubeContents: CubeContentsModel = new CubeContentsModel();
  cubeReactiveModel: CubeReactiveModelModel = new CubeReactiveModelModel();
  cubeMaterial: CubeMaterial = new CubeMaterial();

  userCube: UserCubeModel = new UserCubeModel();

  constructor(cubeDetail?: CubeDetail) {
    if (cubeDetail) {
      const cube = new CubeModel(cubeDetail.cube);
      const cubeContents = new CubeContentsModel(cubeDetail.cubeContents);
      const cubeReactiveModel = new CubeReactiveModelModel(cubeDetail.cubeReactiveModel);
      const cubeMaterial = new CubeMaterial(cubeDetail.cubeMaterial);
      Object.assign(this, { ...cubeDetail, cube, cubeContents, cubeReactiveModel, cubeMaterial });
    }
  }
}

decorate(CubeDetail, {
  cube: observable,
  cubeContents: observable,
  cubeReactiveModel: observable,
  cubeMaterial: observable,
});
