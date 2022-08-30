export enum Language {
  Ko = 'ko',
  En = 'en',
  Zh = 'zh',
  Korean = 'Korean',
  English = 'English',
  Chinese = 'Chinese',
}

export function getLanguage(lang: string): Language {
  //
  let language: Language = Language.En;
  if (lang === 'Korean' || lang === 'ko') {
    language = Language.Ko;
  } else if (lang === 'English' || lang === 'en') {
    language = Language.En;
  } else if (lang === 'Chinese' || lang === 'zh') {
    language = Language.Zh;
  }
  return language;
}

export function getLanguageValue(lang: string): string {
  //
  let language: string = '';
  if (lang === 'Korean' || lang === 'ko') {
    language = 'ko';
  } else if (lang === 'English' || lang === 'en') {
    language = 'en';
  } else if (lang === 'Chinese' || lang === 'zh') {
    language = 'zh';
  }
  return language;
}
