import { NameValue as AccentNameValue } from '@nara.platform/accent';
import { decorate, observable } from 'mobx';

export class NameValue implements AccentNameValue {
  //
  name: string = '';
  value: string = '';

  constructor(nameValue?: NameValue) {
    if (nameValue) {
      Object.assign(this, nameValue);
    }
  }
}

decorate(NameValue, {
  name: observable,
  value: observable,
});
