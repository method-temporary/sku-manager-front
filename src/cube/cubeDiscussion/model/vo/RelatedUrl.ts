import { decorate, observable } from 'mobx';

export class RelatedUrl {
  title: string = '';
  url: string = '';

  constructor(relatedUrl?: RelatedUrl) {
    if (relatedUrl) {
      Object.assign(this, { ...relatedUrl });
    }
  }
}

decorate(RelatedUrl, {
  title: observable,
  url: observable,
});
