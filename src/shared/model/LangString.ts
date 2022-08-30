import { LangString as AccentLangString } from '@nara.platform/accent';
import { decorate, observable } from 'mobx';

export class LangString implements AccentLangString {
  //
  lang: string = '';
  string: string = '';

  constructor(langString?: LangString) {
    if ( langString ) Object.assign(this, langString);
  }
}

decorate(LangString, {
  lang: observable,
  string: observable,
});
