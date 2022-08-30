import { Cube, getIntiCube } from './Cube';
import { CubeContents, getInitCubeContents } from './CubeContents';
import { CubeReactiveModel, getInitCubeReactiveModel } from './CubeReactiveModel';
import { UserIdentity } from '../../shared/UserIdentity';
import { CubeMaterial, getInitCubeMaterial } from './material';

export interface CubeDetail {
  cube: Cube;
  cubeContents: CubeContents;
  cubeMaterial: CubeMaterial;
  cubeReactiveModel: CubeReactiveModel;
  operators: UserIdentity[];
}

export function getIntiCubeDetail(): CubeDetail {
  //
  return {
    cube: getIntiCube(),
    cubeContents: getInitCubeContents(),
    cubeMaterial: getInitCubeMaterial(),
    cubeReactiveModel: getInitCubeReactiveModel(),
    operators: [],
  };
}
