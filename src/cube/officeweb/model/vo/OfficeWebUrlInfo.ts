import { decorate, observable } from 'mobx';

export class OfficeWebUrlInfo {
  //
  title: string = '';
  description: string = '';
  image: string = '';

  constructor(officeWebUrlInfo?: OfficeWebUrlInfo) {
    if (officeWebUrlInfo) {
      Object.assign(this, { ...officeWebUrlInfo });
    }
  }
}

decorate(OfficeWebUrlInfo, {
  title: observable,
  description: observable,
  image: observable,
});
