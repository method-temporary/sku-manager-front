import { decorate, observable } from 'mobx';

export class CommentConfigModel {
  //
  anonymous: boolean = false;
  maxCommentCount: number = 10000;
  maxCommentMessageLength: number = 500;
  maxSubCommentCount: number = 1000;
  maxSubCommentMessageLength: number = 200;
  embeddedSubComment: boolean = false;
  maxEmbeddedSubCommentCount: number = 10;
  maxEmbeddedSubCommentMessageLength: number = 64;
  privateComment: boolean = false;

  constructor(config?: CommentConfigModel) {
    if (config) {
      Object.assign(this, config);
    }
  }
}

decorate(CommentConfigModel, {
  anonymous: observable,
  maxCommentCount: observable,
  maxCommentMessageLength: observable,
  maxSubCommentCount: observable,
  maxSubCommentMessageLength: observable,
  embeddedSubComment: observable,
  maxEmbeddedSubCommentCount: observable,
  maxEmbeddedSubCommentMessageLength: observable,
  privateComment: observable,
});
