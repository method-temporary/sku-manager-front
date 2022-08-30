import { ClassRoomSdo } from '../../../classroom/model/sdo/ClassRoomSdo';
import { MediaSdo } from '../../../media/model/sdo/MediaSdo';
import { BoardSdo } from '../../../board/board/model/sdo/BoardSdo';
import { OfficeWebSdo } from '../../../officeweb/model/sdo/OfficeWebSdo';
import { CubeCommunitySdo } from '../../../community/model/sdo/CubeCommunitySdo';
import { CubeDiscussionSdo } from '../../../cubeDiscussion/model/sdo/CubeDiscussionSdo';
import { decorate, observable } from 'mobx';
import { ClassroomModel } from '../../../classroom';
import { MediaModel } from '../../../media/model/MediaModel';
import Community from '../../../../community/community/model/Community';
import { OfficeWebModel } from '../../../../cubetype';
import { BoardModel } from '../../../board/board/model/BoardModel';
import { CubeDiscussionModel } from '../../../cubeDiscussion/model/CubeDiscussionModel';

export class CubeMaterialSdo {
  //
  classroomSdos: ClassRoomSdo[] = [];
  mediaSdo: MediaSdo = new MediaSdo();
  boardSdo: BoardSdo = new BoardSdo();
  officeWebSdo: OfficeWebSdo = new OfficeWebSdo();
  cubeCommunitySdo: CubeCommunitySdo = new CubeCommunitySdo();
  cubeDiscussionSdo: CubeDiscussionSdo = new CubeDiscussionSdo();

  constructor(cubeMaterialSdo?: CubeMaterialSdo) {
    if (cubeMaterialSdo) {
      const classroomSdos = cubeMaterialSdo.classroomSdos.map((classroomSdo) => new ClassRoomSdo(classroomSdo));
      const mediaSdo = new MediaSdo(cubeMaterialSdo.mediaSdo);
      const boardSdo = new BoardSdo(cubeMaterialSdo.boardSdo);
      const officeWebSdo = new OfficeWebSdo(cubeMaterialSdo.officeWebSdo);
      const cubeCommunitySdo = new CubeCommunitySdo(cubeMaterialSdo.cubeCommunitySdo);
      const cubeDiscussionSdo = new CubeDiscussionSdo(cubeMaterialSdo.cubeDiscussionSdo);
      Object.assign(this, {
        ...cubeMaterialSdo,
        classroomSdos,
        boardSdo,
        cubeCommunitySdo,
        mediaSdo,
        officeWebSdo,
        cubeDiscussionSdo,
      });
    }
  }

  static makeCubeMaterialSdo(
    classrooms: ClassroomModel[],
    media: MediaModel,
    board: BoardModel,
    officeWeb: OfficeWebModel,
    community: Community,
    cubeDiscussion: CubeDiscussionModel
  ): CubeMaterialSdo {
    //
    return {
      classroomSdos: classrooms.map((classroom, index) => ClassroomModel.asSdo(classroom)),
      mediaSdo: MediaModel.asSdo(media),
      boardSdo: BoardModel.asSdo(board),
      officeWebSdo: OfficeWebModel.asSdo(officeWeb),
      cubeCommunitySdo: { communityId: community.communityId ? community.communityId : '' },
      cubeDiscussionSdo: CubeDiscussionModel.asSdo(cubeDiscussion),
    };
  }
}

decorate(CubeMaterialSdo, {
  classroomSdos: observable,
  mediaSdo: observable,
  boardSdo: observable,
  officeWebSdo: observable,
  cubeCommunitySdo: observable,
  cubeDiscussionSdo: observable,
});
