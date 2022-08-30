import { decorate, observable } from 'mobx';

export class PostContentsModel {
  //
  contents: string = '';
  depotId: string = '';

  constructor(postContents?: PostContentsModel) {
    //
    if (postContents) {
      Object.assign(this, { ...postContents });
    }
  }
}

decorate(PostContentsModel, {
  contents: observable,
  depotId: observable,
});
