import { DramaEntityObservableModel } from 'shared/model';
import { decorate, observable } from 'mobx';

export class CubeCommunityModel extends DramaEntityObservableModel {
  //
  communityId: string = '';

  constructor(cubeCommunity?: CubeCommunityModel) {
    super();
    if (cubeCommunity) {
      Object.assign(this, { ...cubeCommunity });
    }
  }
}

decorate(CubeCommunityModel, {
  communityId: observable,
});
