import { decorate, observable } from 'mobx';

export class BoardConfigModel {
  commentForbidden: boolean = false;
  anonymousPostAllowed: boolean = false;
  anonymousCommentAllowed: boolean = false;
  enClosed: boolean = false;
  unLimited: boolean = false;

  constructor(boardConfig?: BoardConfigModel) {
    if (boardConfig) {
      Object.assign(this, { ...boardConfig });
    }
  }
}

decorate(BoardConfigModel, {
  commentForbidden: observable,
  anonymousPostAllowed: observable,
  anonymousCommentAllowed: observable,
  enClosed: observable,
  unLimited: observable,
});
