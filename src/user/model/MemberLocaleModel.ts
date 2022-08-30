import { decorate, observable } from 'mobx';
import { LangStrings } from 'shared/model';

export class MemberLocaleModel {
  nations: LangStrings = new LangStrings();
  languages: LangStrings = new LangStrings();

  constructor(memberLocale?: MemberLocaleModel) {
    if (memberLocale) {
      const nations = (memberLocale.nations && new LangStrings(memberLocale.nations)) || this.nations;
      const languages = (memberLocale.languages && new LangStrings(memberLocale.languages)) || this.languages;

      Object.assign(this, { ...memberLocale, nations, languages });
    }
  }
}

decorate(MemberLocaleModel, {
  nations: observable,
  languages: observable,
});
