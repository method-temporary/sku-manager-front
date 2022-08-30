import { decorate, observable } from 'mobx';

export default class PolyglotString {
  //
  en: string = '';
  ko: string = '';
  zh: string = '';

  constructor(polyglotString?: PolyglotString) {
    if (polyglotString) {
      Object.assign(this, { ...polyglotString });
    }
  }

  static asValues(polyglotString: PolyglotString) {
    //
    const target: any = {};
    if (polyglotString.ko) {
      target.k = polyglotString.ko;
    }
    if (polyglotString.en) {
      target.e = polyglotString.en;
    }
    if (polyglotString.zh) {
      target.c = polyglotString.zh;
    }
    return target;
  }
}

decorate(PolyglotString, {
  en: observable,
  ko: observable,
  zh: observable,
});
