import { decorate, observable } from 'mobx';

export default class RelatedUrl {
  title: string = '';
  url: string = '';
}

decorate(RelatedUrl, {
  title: observable,
  url: observable,
});
