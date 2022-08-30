import { decorate, observable } from 'mobx';
import { EmbeddedSubCommentModel } from './EmbeddedSubCommentModel';

export class EmbeddedSubCommentListModel {
  //
  embeddedSubComments: EmbeddedSubCommentModel[] = [];

  constructor(commentList?: EmbeddedSubCommentListModel) {
    if (commentList) {
      const embeddedSubComments = commentList.embeddedSubComments
        && commentList.embeddedSubComments.map(embeddedSubComment => new EmbeddedSubCommentModel(embeddedSubComment)) || this.embeddedSubComments;
      Object.assign(this, { ...commentList, embeddedSubComments });
    }
  }
}

decorate(EmbeddedSubCommentListModel, {
  embeddedSubComments: observable,
});
