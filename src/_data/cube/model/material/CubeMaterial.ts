import { Board, getInitBoard } from './Board';
import { Classroom } from './Classroom';
import { CubeCommunity, getInitCubeCommunity } from './CubeCommunity';
import { CubeDiscussion, getInitCubeDiscussion } from './CubeDiscussion';
import { getInitMedia, Media } from './Media';
import { getInitOfficeWeb, OfficeWeb } from './OfficeWeb';

export interface CubeMaterial {
  board: Board;
  classrooms: Classroom[];
  cubeCommunity: CubeCommunity;
  cubeDiscussion: CubeDiscussion;
  media: Media;
  officeWeb: OfficeWeb;
}

export function getInitCubeMaterial(): CubeMaterial {
  //
  return {
    board: getInitBoard(),
    classrooms: [],
    cubeCommunity: getInitCubeCommunity(),
    cubeDiscussion: getInitCubeDiscussion(),
    media: getInitMedia(),
    officeWeb: getInitOfficeWeb(),
  };
}
