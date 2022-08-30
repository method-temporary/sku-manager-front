export interface CommentConfig {
  anonymous: boolean;
  deletable: boolean;
  embeddedSubComment: boolean;
  eventable: boolean;
  managerPatronKeys: string[];
  maxCommentCount: number;
  maxCommentMessageLength: number;
  maxEmbeddedSubCommentCount: number;
  maxEmbeddedSubCommentMessageLength: number;
  maxSubCommentCount: number;
  maxSubCommentMessageLength: number;
  privateComment: boolean;
}
