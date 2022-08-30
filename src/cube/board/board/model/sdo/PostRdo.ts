import { decorate, observable } from 'mobx';

import { AudienceKey } from '@nara.platform/accent';

import { PatronKey } from 'shared/model';

export class PostRdo {
  //
  audienceKey: AudienceKey = new PatronKey();
  title: string = '';
  writer: string = '';
  commentFeedbackId: string = '';

  boardId: string = '';

  postId: string = '';
  contents: string = '';
  fileBoxID: string = '';

  pinned: boolean = false;

  constructor(postRdo?: PostRdo) {
    if (postRdo) {
      Object.assign(this, { ...postRdo });
    }
  }
}

decorate(PostRdo, {
  audienceKey: observable,
  title: observable,
  writer: observable,
  commentFeedbackId: observable,

  boardId: observable,

  postId: observable,
  contents: observable,
  fileBoxID: observable,

  pinned: observable,
});
