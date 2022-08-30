import { decorate, observable } from 'mobx';
import { PolyglotModel } from 'shared/model';
import RelatedUrl from './RelatedUrl';

export default class Discussion {
  commentFeedbackId?: '';
  id: string = '';
  title: PolyglotModel = new PolyglotModel();
  content: PolyglotModel = new PolyglotModel();
  depotId: string = '';
  relatedUrlList: RelatedUrl[] = [new RelatedUrl()];
  privateComment: boolean = false;

  constructor(discussion?: Discussion) {
    //
    if (discussion) {
      Object.assign(this, { ...discussion });
    }
  }
}

decorate(Discussion, {
  commentFeedbackId: observable,
  id: observable,
  title: observable,
  content: observable,
  depotId: observable,
  relatedUrlList: observable,
  privateComment: observable,
});
