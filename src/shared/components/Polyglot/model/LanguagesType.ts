import { Language } from './Language';
import LangSupport from './LangSupport';

export const DEFAULT_LANGUAGE = new LangSupport({ defaultLang: true, lang: Language.Ko });
export const ALL_LANGUAGES = [
  new LangSupport({ defaultLang: true, lang: Language.Ko }),
  new LangSupport({ defaultLang: false, lang: Language.En }),
  new LangSupport({ defaultLang: false, lang: Language.Zh }),
];

const LanguageTypes: LanguageType[] = [
  {
    indexingId: 0,
    value: new LangSupport({ defaultLang: false, lang: Language.Korean }),
    text: 'KO',
    key: 'Korean',
  },
  {
    indexingId: 1,
    value: new LangSupport({ defaultLang: false, lang: Language.English }),
    text: 'EN',
    key: 'English',
  },
  {
    indexingId: 2,
    value: new LangSupport({ defaultLang: false, lang: Language.Chinese }),
    text: 'ZH',
    key: 'Chinese',
  },
];
//langSupports가 en,ko,zh 형식이 아닌 English,Korean,Chinese로 변경됨

export interface LanguageType {
  indexingId: number;
  key: string;
  text: string;
  value: LangSupport;
}

function getLanguageType(value: Language): LanguageType | null {
  //
  if (value === 'Korean') value = Language.Ko;
  else if (value === 'English') value = Language.En;
  else if (value === 'Chinese') value = Language.Zh;
  // LangSupport 는 FullName 이지만 Polyglot 은 약어이기 때문에 변환해서 Key 로 만들어야 하기 때문에 롤백
  // -> Back-end response 하거나 Param 으로 보낼때에만 FullName 으로 보내거나 받고,
  // -> Front-end 에서는 약어로 사용
  //langSupports가 en,ko,zh 형식이 아닌 English,Korean,Chinese로 변경됨

  return LanguageTypes.find((languageType) => languageType.value.lang === value) || null;
}

export { LanguageTypes, getLanguageType };
