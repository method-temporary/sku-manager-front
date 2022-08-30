import { decorate, observable } from 'mobx';
import { LangStrings } from '@nara.platform/accent';

export default class LangStringsModel implements LangStrings {
  //
  defaultLanguage: string = 'ko';
  string: string = '';
  langStringMap: Map<string, string> = new Map<string, string>();

  constructor(langStrings?: LangStrings) {
    if (langStrings) {
      Object.assign(this, langStrings);
      this.langStringMap = langStrings.langStringMap && new Map<string, string>(Object.entries(langStrings.langStringMap)) || this.langStringMap;
    }
  }
}

decorate(LangStringsModel, {
  defaultLanguage: observable,
  langStringMap: observable,
});

