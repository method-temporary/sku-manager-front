import { LangStrings as AccentLangStrings } from '@nara.platform/accent';
import { decorate, observable, toJS } from 'mobx';

export class LangStrings implements AccentLangStrings {
  //
  langStringMap: Map<string, string> = new Map<string, string>();
  defaultLanguage: string = '';
  string: string = '';

  constructor(langStrings?: LangStrings) {
    if (langStrings) {
      langStrings = toJS(langStrings);
      const langStringMap =
        (langStrings.langStringMap && new Map(Object.entries(langStrings.langStringMap))) || new Map<string, string>();
      Object.assign(this, { ...langStrings, langStringMap });
    }
  }
}

decorate(LangStrings, {
  langStringMap: observable,
});

// export function makeMapByLangStrings(langStrings: LangStrings) {
//   const map = new Map();
//   if (langStrings && langStrings.langStrings && langStrings.langStrings.length) {
//     langStrings.langStrings.forEach((langString: LangString) => {
//       map.set(langString.lang, langString.string);
//     });
//   }
//   return map;
// }
