import { decorate, observable } from 'mobx';
import { AudienceKey } from '@nara.platform/accent';
import { PatronKey } from 'shared/model';

export class PostBodyCdo {
  //
  audienceKey: AudienceKey = new PatronKey();
  postId: string = '';
  contents: string = '';
  fileBoxId: string = '';

  constructor(postBodyCdo?: PostBodyCdo) {
    if (postBodyCdo) {
      Object.assign(this, { ...postBodyCdo });
    }
  }
}

decorate(PostBodyCdo, {
  audienceKey: observable,
  postId: observable,
  contents: observable,
  fileBoxId: observable,
});
