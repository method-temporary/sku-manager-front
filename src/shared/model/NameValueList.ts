import { NameValue, NameValueList as AccentNameValueList } from '@nara.platform/accent';
import { decorate, observable } from 'mobx';

export class NameValueList implements AccentNameValueList {
  //
  nameValues: NameValue[] = [];

  constructor(nameValueList?: NameValueList) {
    if (nameValueList) {
      Object.assign(this);
    }
  }
}

decorate(NameValueList, {
  nameValues: observable,
});
