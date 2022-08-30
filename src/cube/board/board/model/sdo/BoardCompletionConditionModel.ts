import { decorate, observable } from 'mobx';

export class BoardCompletionConditionModel {
  //
  commentCount: number = 0;
  subCommentCount: number = 0;

  constructor(boardCompletionConditionModel?: BoardCompletionConditionModel) {
    if (boardCompletionConditionModel) {
      Object.assign(this, { ...boardCompletionConditionModel });
    }
  }
}

decorate(BoardCompletionConditionModel, {
  commentCount: observable,
  subCommentCount: observable
});
