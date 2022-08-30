import { decorate, observable } from 'mobx';
import { AudienceKey } from '@nara.platform/accent';
import { PatronKey } from 'shared/model';

export class ReplyCdo {
  //
  audienceKey: AudienceKey = new PatronKey();
  title: string = '';
  writer: string = '';
  commentFeedbackId: string = '';

  postId: string = '';
  fileBoxId: string = '';

  constructor(replyCdo?: ReplyCdo) {
    if (replyCdo) {
      Object.assign(this, { ...replyCdo });
    }
  }
}

decorate(ReplyCdo, {
  audienceKey: observable,
  title: observable,
  writer: observable,
  commentFeedbackId: observable,

  postId: observable,
  fileBoxId: observable,
});
