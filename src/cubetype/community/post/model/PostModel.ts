import { DomainEntity } from '@nara.platform/accent';
import { decorate, observable } from 'mobx';
import { WriterModel } from '../../../../cube/board/post/model/WriterModel';

export class PostModel implements DomainEntity {
  id: string = '';
  entityVersion: number = 0;

  audienceKey: string = 'r2p8-r@nea-m5-c5';
  title: string = '';
  writer: WriterModel = new WriterModel();
  readCount: number = 0; // ReadLog 서비스에서 처리함
  time: number = 0;
  commentFeedbackId: string = '';
  boardId: string = '';

  constructor(post?: PostModel) {
    if (post) {
      const writer = (post.writer && new WriterModel(post.writer)) || this.writer;
      Object.assign(this, { ...post, writer });
    }
  }
}

decorate(PostModel, {
  id: observable,
  entityVersion: observable,
  audienceKey: observable,
  title: observable,
  writer: observable,
  commentFeedbackId: observable,
});
