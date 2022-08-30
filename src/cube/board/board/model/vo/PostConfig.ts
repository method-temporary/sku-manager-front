import { decorate, observable } from 'mobx';

export class PostConfig {
  //
  commentForbidden: boolean = false;
  anonymousCommentAllowed: boolean = false;
  maxCommentLength: number = 500;
  maxReplyLength: number = 200;

  constructor(postConfig?: PostConfig) {
    if (postConfig) {
      Object.assign(this, { ...postConfig });
    }
  }
}

decorate(PostConfig, {
  commentForbidden: observable,
  anonymousCommentAllowed: observable,
  maxCommentLength: observable,
  maxReplyLength: observable,
});
