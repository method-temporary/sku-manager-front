import { decorate, observable } from 'mobx';

export class DiscussionCubeCompletionCondition {
  //
  commentCount: number = 0;
  subCommentCount: number = 0;

  constructor(discussionCubeCompletionCondition?: DiscussionCubeCompletionCondition) {
    if (discussionCubeCompletionCondition) {
      Object.assign(this, { ...discussionCubeCompletionCondition });
    }
  }
}

decorate(DiscussionCubeCompletionCondition, {
  commentCount: observable,
  subCommentCount: observable,
});
