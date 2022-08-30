import { decorate, observable } from 'mobx';

export class ReplyConfig {
  //
  commentForbidden: boolean = false;
  anonymousCommentAllowed: boolean = false;
  maxCommentLength: number = 500;
  maxReplyLength: number = 200;

  constructor(replyConfig?: ReplyConfig) {
    if (replyConfig) {
      Object.assign(this, { ...replyConfig });
    }
  }
}

decorate(ReplyConfig, {
  commentForbidden: observable,
  anonymousCommentAllowed: observable,
  maxCommentLength: observable,
  maxReplyLength: observable,
});
