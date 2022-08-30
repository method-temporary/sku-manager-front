import { DramaEntityObservableModel } from 'shared/model';
import { decorate, observable } from 'mobx';

export class ReplyModel extends DramaEntityObservableModel {
  //
  title: string = '';
  contents: string = '';
  writer: string = '';
  readCount: number = 0;
  commentFeedbackId: string = '';
  postId: string = '';
  fileBoxId: string = '';
  deleted: boolean = false;

  registeredTime: number = 0;

  constructor(reply?: ReplyModel) {
    super();
    if (reply) {
      Object.assign(this, { ...reply });
    }
  }
}

decorate(ReplyModel, {
  title: observable,
  contents: observable,
  writer: observable,
  readCount: observable,
  commentFeedbackId: observable,
  postId: observable,
  fileBoxId: observable,
  deleted: observable,
  registeredTime: observable,
});
