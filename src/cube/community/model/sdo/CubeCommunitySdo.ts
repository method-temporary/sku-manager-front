import { decorate, observable } from 'mobx';

export class CubeCommunitySdo {
  //
  communityId: string = '';

  constructor(cubeCommunitySdo?: CubeCommunitySdo) {
    if (cubeCommunitySdo) {
      Object.assign(this, { ...cubeCommunitySdo });
    }
  }
}

decorate(CubeCommunitySdo, {
  communityId: observable,
});
