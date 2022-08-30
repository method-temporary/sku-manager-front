import { BoardSdo, BoardSdoFunc } from './BoardSdo';
import { ClassroomSdo, ClassroomSdoFunc } from './ClassroomSdo';
import { CubeCommunitySdo, CubeCommunitySdoFunc } from './CubeCommunitySdoFunc';
import { MediaSdo, MediaSdoFunc } from './MediaSdo';
import { CubeDiscussionSdo, CubeDiscussionSdoFunc } from './CubeDiscussionSdo';
import { CubeMaterial } from './CubeMaterial';
import { OfficeWebSdo, OfficeWebSdoFunc } from './OfficeWebSdo';

export interface CubeMaterialSdo {
  boardSdo?: BoardSdo;
  classroomSdos?: ClassroomSdo[];
  cubeCommunitySdo?: CubeCommunitySdo;
  cubeDiscussionSdo?: CubeDiscussionSdo;
  mediaSdo?: MediaSdo;
  officeWebSdo?: OfficeWebSdo;
}

function fromCubeMaterial(material: CubeMaterial): CubeMaterialSdo {
  //
  const classroomSdos =
    (material.classrooms && material.classrooms.map((classroom) => ClassroomSdoFunc.fromClassroom(classroom))) || [];

  return {
    boardSdo: BoardSdoFunc.fromBoard(material.board),
    classroomSdos,
    cubeCommunitySdo: CubeCommunitySdoFunc.fromCommunity(material.cubeCommunity),
    cubeDiscussionSdo: CubeDiscussionSdoFunc.fromCubeDiscussion(material.cubeDiscussion),
    mediaSdo: MediaSdoFunc.fromMedia(material.media),
    officeWebSdo: OfficeWebSdoFunc.fromOfficeWeb(material.officeWeb),
  };
}

export const CubeMaterialSdoFunc = { fromCubeMaterial };
