import { decorate, observable } from 'mobx';

export class PostConfigModel {
  //
  replyable: boolean = false;
  notifiable: boolean = false;
  shareable: boolean = false;
  isAnswered: boolean = false;

  sourceType: string = '';
  sourceId: string = '';

  constructor(postConfig?: PostConfigModel) {
    //
    if (postConfig) {
      Object.assign(this, { ...postConfig });
    }
  }
}

decorate(PostConfigModel, {
  replyable: observable,
  notifiable: observable,
  shareable: observable,
  isAnswered: observable,
  sourceType: observable,
  sourceId: observable,
});

