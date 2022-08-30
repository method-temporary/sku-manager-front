import { PatronKey as AccentPatronKey, PatronType } from '@nara.platform/accent';
import { decorate, observable } from 'mobx';

export class PatronKey implements AccentPatronKey {
  //
  // keyString: string = 'R5-R@NEA-M5-T3C';
  keyString: string = '';
  patronType: PatronType = PatronType.Audience;
  constructor(patronKey?: PatronKey) {
    if (patronKey) {
      Object.assign(this, patronKey);
    }
  }

  static getCineroomId(patronKey: PatronKey) {
    return patronKey.keyString.slice(patronKey.keyString.indexOf('@') + 1);
  }
}

decorate(PatronKey, {
  keyString: observable,
  patronType: observable,
});
