import { PolyglotModel } from 'shared/model';

export default class DuplicateCubeNameRdo {
  //
  id?: string | undefined = undefined;
  name: PolyglotModel = new PolyglotModel();

  constructor(rdo?: DuplicateCubeNameRdo) {
    if (rdo) {
      //
      Object.assign(this, { ...rdo });
    }
  }
}
