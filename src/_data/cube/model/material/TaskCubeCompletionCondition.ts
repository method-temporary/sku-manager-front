export interface TaskCubeCompletionCondition {
  commentCount: number;
  postCount: number;
  subCommentCount: number;
}

export function getInitTaskCubeCompletionCondition(): TaskCubeCompletionCondition {
  //
  return {
    commentCount: 0,
    postCount: 0,
    subCommentCount: 0,
  };
}
