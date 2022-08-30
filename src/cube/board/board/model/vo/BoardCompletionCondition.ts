import { decorate, observable } from 'mobx';

export class BoardCompletionCondition {
  //
  postCount: number = 0;
  commentCount: number = 0;
  subCommentCount: number = 0;

  constructor(boardCompletionCondition?: BoardCompletionCondition) {
    if (boardCompletionCondition) {
      Object.assign(this, { ...boardCompletionCondition });
    }
  }
}

decorate(BoardCompletionCondition, {
  postCount: observable,
  commentCount: observable,
  subCommentCount: observable
});
