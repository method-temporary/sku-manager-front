export interface DiscussionCubeCompletionCondition {
  commentCount: number;
  subCommentCount: number;
}

export function getInitDiscussionCubeCompletionCondition(): DiscussionCubeCompletionCondition {
  //
  return {
    commentCount: 0,
    subCommentCount: 0,
  };
}
