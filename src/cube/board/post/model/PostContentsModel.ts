import { decorate, observable } from 'mobx';

import { PolyglotModel } from 'shared/model';
import { PostContentsContentsModel } from './PostContentsContentsModel';

export class PostContentsModel {
  //
  contents: PostContentsContentsModel[] = [];
  depotId: string = '';
  constructor(postContents?: PostContentsModel) {
    //
    let contents = this.contents;

    if (postContents) {
      const copyContents = { ...postContents.contents };

      if (copyContents) {
        contents = postContents.contents.map((content) => new PostContentsContentsModel(content));
      }
      Object.assign(this, { ...postContents, contents });
    }
  }
}

decorate(PostContentsModel, {
  contents: observable,
  depotId: observable,
});

export function initNoticePostContents(): PostContentsModel {
  //
  return {
    contents: [new PostContentsContentsModel({ contents: new PolyglotModel(), exposureType: 'PC' })],
    depotId: '',
  };
}

export function initFAQPostContents(): PostContentsModel {
  //
  return {
    contents: [new PostContentsContentsModel({ contents: new PolyglotModel(), exposureType: '' })],
    depotId: '',
  };
}
