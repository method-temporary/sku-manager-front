import { decorate, observable } from 'mobx';

export class BoardConfig {
  //
  commentForbidden: boolean = false;
  anonymousPostAllowed: boolean = false;
  anonymousCommentAllowed: boolean = false;
  enClosed: boolean = false;
  unLimited: boolean = false;

  constructor(boardConfig?: BoardConfig) {
    if (boardConfig) {
      Object.assign(this, { ...boardConfig });
    }
  }
}

decorate(BoardConfig, {
  commentForbidden: observable,
  anonymousPostAllowed: observable,
  anonymousCommentAllowed: observable,
  enClosed: observable,
  unLimited: observable,
});
