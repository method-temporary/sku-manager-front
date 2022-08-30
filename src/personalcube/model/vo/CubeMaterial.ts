import { decorate, observable } from 'mobx';
import { BoardModel } from '../../../cube/board/board/model/BoardModel';
import { OfficeWebModel } from '../../../cube/officeweb/model/OfficeWebModel';
import { CubeCommunityModel } from '../../../cube/community/model/CubeCommunityModel';
import { MediaModel } from '../../../cube/media/model/MediaModel';
import { ClassroomModel } from 'cube/classroom/model/ClassroomModel';

export class CubeMaterial {
  //
  classrooms: ClassroomModel[] = [];
  media: MediaModel = new MediaModel();
  board: BoardModel = new BoardModel();
  officeWeb: OfficeWebModel = new OfficeWebModel();
  cubeCommunity: CubeCommunityModel = new CubeCommunityModel();

  constructor(cubeMaterial?: CubeMaterial) {
    if (cubeMaterial) {
      const media = new MediaModel(cubeMaterial.media);
      const board = new BoardModel(cubeMaterial.board);
      const officeWeb = new OfficeWebModel(cubeMaterial.officeWeb);
      const cubeCommunity = new CubeCommunityModel(cubeMaterial.cubeCommunity);
      Object.assign(this, { ...cubeMaterial, media, board, officeWeb, cubeCommunity });
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
