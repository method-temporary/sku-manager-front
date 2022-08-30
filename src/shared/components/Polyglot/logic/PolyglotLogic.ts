import { PolyglotModel } from '../../../model/PolyglotModel';
import { getLanguageType } from '../model/LanguagesType';
import LangSupport from '../model/LangSupport';
import { Language } from '../model/Language';
import _ from 'lodash';

export function getPolyglotToString(name: PolyglotModel, defaultLanguage: Language = Language.Korean): string {
  //
  // const language = localStorage.getItem('language') || '';
  const key = getLanguageType(defaultLanguage)?.value.lang;

  if (name === null || name === undefined) {
    return '';
  }

  // null을 리턴하면 Polyglot.Input의 UI가 깨짐
  if (key === Language.Ko || key === Language.Korean) {
    return name.ko || '';
  } else if (key === Language.En || key === Language.English) {
    return name.en || '';
  } else if (key === Language.Zh || key === Language.Chinese) {
    return name.zh || '';
  } else {
    return name.ko || '';
  }
  //return name.getValue(key || Language.Korean) || name.getValue(defaultLanguage); // 에러
}

export function getPolyglotToAnyString(name?: PolyglotModel, defaultLanguage?: Language): string {
  //
  let value = '';

  if (name === null || name === undefined) {
    return value;
  }

  // 현재 사용자가 보고 있는 Language
  const language = localStorage.getItem('language') || '';
  value = getValue(name, language);

  // 현재 사용자가 보고 있는 Language 의 값이 없으면 Default 의 값
  if (value === '' && defaultLanguage) {
    const key = getLanguageType(defaultLanguage)?.value.lang;
    value = getValue(name, key);
  }

  // Default 의 값도 없으면 Ko, En, Zh 순으로 있는 값 반환
  if (value === '') {
    value = getAnyValue(name);
  }

  return value;
}

export function getPolyglotToDefaultString(name: PolyglotModel, defaultLanguage: Language): string {
  //
  let value = '';

  // 현재 사용자가 보고 있는 Language
  const key = getLanguageType(defaultLanguage)?.value.lang;
  value = getValue(name, key);

  // Default 의 값이 없으면 현재 사용자가 보고 있는 Language 의 값
  // if (value === '') {
  //   const language = localStorage.getItem('language') || '';
  //   value = getValue(name, language);
  // }

  // Default 의 값도 없으면 Ko, En, Zh 순으로 있는 값 반환
  if (value === '') {
    value = getAnyValue(name);
  }

  return value;
}

function getValue(name: PolyglotModel, key?: Language | string): string {
  //
  if (!key) return '';

  if (key === Language.Ko || key === Language.Korean || key === 'ko') {
    return name.ko || '';
  } else if (key === Language.En || key === Language.English || key === 'en') {
    return name.en || '';
  } else if (key === Language.Zh || key === Language.Chinese || key === 'zh') {
    return name.zh || '';
  }

  return '';
}

function getAnyValue(name: PolyglotModel): string {
  //
  return name.ko !== '' ? name.ko : name.en !== '' ? name.en : name.zh !== '' ? name.zh : '';
}

export function getDefaultLanguage(langSupports?: LangSupport[]): Language {
  //
  if (langSupports === undefined || langSupports === null || langSupports.length < 1) {
    return Language.Ko;
  }
  return langSupports.find((target) => target.defaultLang)!.lang || Language.Ko;
}

export function isPolyglotBlank(langSupports: LangSupport[], strings: PolyglotModel): boolean {
  if (strings === null) {
    return true;
  }
  let returnMsg = false;
  langSupports.map((langSupport) => {
    if (langSupport.lang === Language.Ko && (_.trim(strings.ko) === '' || strings.ko === '<p><br></p>')) {
      returnMsg = true;
    }
    if (langSupport.lang === Language.En && (_.trim(strings.en) === '' || strings.en === '<p><br></p>')) {
      returnMsg = true;
    }
    if (langSupport.lang === Language.Zh && (_.trim(strings.zh) === '' || strings.zh === '<p><br></p>')) {
      returnMsg = true;
    }
  });

  return returnMsg;
}

export function isDefaultPolyglotBlank(langSupports: LangSupport[], strings: PolyglotModel): boolean {
  if (strings === null) {
    return true;
  }
  let returnMsg = false;
  langSupports.map((langSupport) => {
    if (
      (langSupport.defaultLang && getPolyglotToString(strings, langSupport.lang) === '') ||
      getPolyglotToString(strings, langSupport.lang) === null
    ) {
      returnMsg = true;
    }
  });

  return returnMsg;
}

export function isPolyglotEmpty(polyglot: PolyglotModel) {
  //
  return !polyglot
    ? true
    : (polyglot.ko === null || polyglot.ko === '' || polyglot.ko === '<p><br></p>') &&
        (polyglot.en === null || polyglot.en === '' || polyglot.en === '<p><br></p>') &&
        (polyglot.zh === null || polyglot.zh === '' || polyglot.zh === '<p><br></p>');
}

export function isComparePolyglot(prev: PolyglotModel, next: PolyglotModel) {
  //
  if (prev?.ko !== next?.ko || prev?.en !== next?.en || prev?.zh !== next?.zh) {
    return false;
  }
  return true;
}

export function isComparePolyglotAnd(prev: PolyglotModel, next: PolyglotModel) {
  //
  if (prev?.ko !== next?.ko && prev?.en !== next?.en && prev?.zh !== next?.zh) {
    return false;
  }
  return true;
}

export function setPolyglotValues(korean: string, english: string, chinese: string): PolyglotModel {
  //
  const polyglot = new PolyglotModel();
  polyglot.setValue(Language.Ko, korean);
  polyglot.setValue(Language.En, english);
  polyglot.setValue(Language.Zh, chinese);

  return polyglot;
}

export function setLangSupports(
  korean: string,
  english: string,
  chinese: string,
  defaultLanguage: string | Language = Language.Korean
): LangSupport[] {
  const langSupports = [];
  if (korean !== '') {
    const langSupport = new LangSupport();
    langSupport.lang = Language.Korean;
    if (defaultLanguage === Language.Korean) {
      langSupport.defaultLang = true;
    }
    langSupports.push(langSupport);
  }
  if (english !== '') {
    const langSupport = new LangSupport();
    langSupport.lang = Language.English;
    if (defaultLanguage === Language.English) {
      langSupport.defaultLang = true;
    }
    langSupports.push(langSupport);
  }
  if (chinese !== '') {
    const langSupport = new LangSupport();
    langSupport.lang = Language.Chinese;
    if (defaultLanguage === Language.Chinese) {
      langSupport.defaultLang = true;
    }
    langSupports.push(langSupport);
  }
  return langSupports;
}

export function parserLanguageTextToShort(target: string): string {
  //
  let value = '';
  if (target === 'Korean') {
    value = 'ko';
  }

  if (target === 'English') {
    value = 'en';
  }

  if (target === 'Chinese') {
    value = 'ch';
  }
  return value;
}

export function parserLanguageTextToFull(target: string): string {
  //
  let value = '';
  if (target === 'ko') {
    value = 'Korean';
  }

  if (target === 'en') {
    value = 'English';
  }

  if (target === 'ch') {
    value = 'Chinese';
  }
  return value;
}
