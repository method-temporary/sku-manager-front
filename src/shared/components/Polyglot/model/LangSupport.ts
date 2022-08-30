import { Language } from './Language';

export default class LangSupport {
  //
  defaultLang: boolean = false;
  lang: Language = Language.En;

  constructor(langSupport?: LangSupport) {
    if (langSupport) {
      let lang = langSupport.lang;

      if (langSupport.lang === Language.Korean) lang = Language.Ko;
      else if (langSupport.lang === Language.English) lang = Language.En;
      else if (langSupport.lang === Language.Chinese) lang = Language.Zh;

      // LangSupport 는 FullName 이지만 Polyglot 은 약어이기 때문에 변환해서 Key 로 만들어야 하기 때문에 롤백
      // -> Back-end response 하거나 Param 으로 보낼때에만 FullName 으로 보내거나 받고,
      // -> Front-end 에서는 약어로 사용
      // const lang = langSupport.lang;

      Object.assign(this, { ...langSupport, lang });
    }
  }
}

export function langSupportCdo(langSupports: LangSupport[]): LangSupport[] {
  //
  const result: LangSupport[] = [];

  langSupports.forEach((langSupport) => {
    if (langSupport.lang === Language.Ko || langSupport.lang === Language.Korean) {
      result.push({ lang: Language.Korean, defaultLang: langSupport.defaultLang });
    } else if (langSupport.lang === Language.En || langSupport.lang === Language.English) {
      result.push({ lang: Language.English, defaultLang: langSupport.defaultLang });
    } else if (langSupport.lang === Language.Zh || langSupport.lang === Language.Chinese) {
      result.push({ lang: Language.Chinese, defaultLang: langSupport.defaultLang });
    }
  });
  return result;
}

export function langSupportDefault(langSupports: LangSupport[]) {
  //
  return langSupports.find((langSupport) => langSupport.defaultLang)?.lang;
}
