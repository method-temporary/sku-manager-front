import { ClassroomModel } from '../../../classroom';
import { MediaModel } from '../../../media/model/MediaModel';
import { BoardModel } from '../../../board/board/model/BoardModel';
import { OfficeWebModel } from '../../../officeweb/model/OfficeWebModel';
import { CubeCommunityModel } from '../../../community';
import { decorate, observable } from 'mobx';
import { CubeDiscussionModel } from 'cube/cubeDiscussion/model/CubeDiscussionModel';

export class CubeMaterial {
  //
  classrooms: ClassroomModel[] = [];
  media: MediaModel = new MediaModel();
  board: BoardModel = new BoardModel();
  officeWeb: OfficeWebModel = new OfficeWebModel();
  cubeCommunity: CubeCommunityModel = new CubeCommunityModel();
  cubeDiscussion: CubeDiscussionModel = new CubeDiscussionModel();

  constructor(cubeMaterial?: CubeMaterial) {
    if (cubeMaterial) {
      const classrooms =
        cubeMaterial.classrooms && cubeMaterial.classrooms.map((classroom) => new ClassroomModel(classroom));
      const media = new MediaModel(cubeMaterial.media);
      const board = new BoardModel(cubeMaterial.board);
      const officeWeb = new OfficeWebModel(cubeMaterial.officeWeb);
      const cubeCommunity = new CubeCommunityModel(cubeMaterial.cubeCommunity);
      const cubeDiscussion = new CubeDiscussionModel(cubeMaterial.cubeDiscussion);
      Object.assign(this, { ...cubeMaterial, classrooms, media, board, officeWeb, cubeCommunity, cubeDiscussion });
    }
  }
}

decorate(CubeMaterial, {
  classrooms: observable,
  media: observable,
  board: observable,
  officeWeb: observable,
  cubeCommunity: observable,
});
