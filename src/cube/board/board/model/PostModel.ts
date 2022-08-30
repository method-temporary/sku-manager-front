import { decorate, observable } from 'mobx';

import { DramaEntityObservableModel, IdName } from 'shared/model';
import { PostBodyModel } from './PostBodyModel';

export class PostModel extends DramaEntityObservableModel {
  //
  title: string = '';
  writer: string = '';
  readCount: number = 0;
  registeredTime: number = 0;
  commentFeedbackId: string = '';

  boardId: string = '';

  replies: IdName[] = [];
  deleted: boolean = false;
  pinned: boolean = false;

  postBody: PostBodyModel = new PostBodyModel();

  constructor(post?: PostModel) {
    super();
    if (post) {
      const replies = post.replies.map((reply) => new IdName(reply));
      const postBody = new PostBodyModel(post.postBody);
      Object.assign(this, { ...post, replies, postBody });
    }
  }
}

decorate(PostModel, {
  title: observable,
  writer: observable,
  readCount: observable,
  registeredTime: observable,
  commentFeedbackId: observable,

  boardId: observable,

  replies: observable,
  deleted: observable,
  pinned: observable,

  postBody: observable,
});
