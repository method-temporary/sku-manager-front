import { decorate, observable } from 'mobx';
import { CommentConfigModel } from './CommentConfigModel';

export class CommentFeedbackModel {
  //
  config: CommentConfigModel = new CommentConfigModel();
  time: number = 0;
  title: string = '';

  constructor(commentFeedback?: CommentFeedbackModel) {
    const config = commentFeedback && new CommentConfigModel(commentFeedback.config) || this.config;
    if (commentFeedback) {
      Object.assign(this, { ...commentFeedback, config });
    }
  }
}

decorate(CommentFeedbackModel, {
  config: observable,
  time: observable,
  title: observable,
});

