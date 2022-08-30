import { decorate, observable } from 'mobx';

export class WebUrlInfo {
  //
  title: string = '';
  description: string = '';
  image: string = '';

  constructor(webUrlInfo?: WebUrlInfo) {
    if (webUrlInfo) {
      Object.assign(this, { ...webUrlInfo });
    }
  }
}

decorate(WebUrlInfo, {
  title: observable,
  description: observable,
  image: observable,
});
