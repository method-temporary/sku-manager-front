import { decorate, observable } from 'mobx';
import { ExposureType } from './vo/ExposureType';
import { PolyglotModel } from '../../../../shared/model';

export class PostContentsContentsModel {
  //
  exposureType: ExposureType = '';
  contents: PolyglotModel = new PolyglotModel();

  constructor(postContentsContents?: PostContentsContentsModel) {
    //
    if (postContentsContents) {
      const contents =
        (postContentsContents.contents && new PolyglotModel(postContentsContents.contents)) || this.contents;
      Object.assign(this, { ...postContentsContents, contents });
    }
  }
}

decorate(PostContentsContentsModel, {
  exposureType: observable,
  contents: observable,
});
