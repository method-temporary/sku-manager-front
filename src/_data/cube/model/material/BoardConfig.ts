export interface BoardConfig {
  anonymousCommentAllowed: boolean;
  anonymousPostAllowed: boolean;
  commentForbidden: boolean;
  enClosed: boolean;
  unLimited: boolean;
}

export function getInitBoardConfig(): BoardConfig {
  //
  return {
    anonymousCommentAllowed: false,
    anonymousPostAllowed: false,
    commentForbidden: false,
    enClosed: false,
    unLimited: false,
  };
}
