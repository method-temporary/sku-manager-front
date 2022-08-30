import { decorate, observable } from 'mobx';
import { AudienceKey } from '@nara.platform/accent';
import { PatronKey } from 'shared/model';

export class PostCdo {
  //
  audienceKey: AudienceKey = new PatronKey();
  title: string = '';
  writer: string = '';
  commentFeedbackId: string = '';

  boardId: string = '';
  pinned: boolean = false;

  constructor(postCdo?: PostCdo) {
    if (postCdo) {
      Object.assign(this, { ...postCdo });
    }
  }
}

decorate(PostCdo, {
  audienceKey: observable,
  title: observable,
  writer: observable,
  commentFeedbackId: observable,

  boardId: observable,
  pinned: observable,
});
