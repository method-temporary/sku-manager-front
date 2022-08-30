import moment from 'moment';
import { PolyglotModel } from './PolyglotModel';

export interface NaOffsetElementDetail<T> {
  id: string;
  name: string;
  exposureDateOption: boolean;
  state: string;
  koreanTexts: string[];
  englishTexts: string[];
  chineseTexts: string[];
  startDate: number;
  endDate: number;
  registrantName: PolyglotModel;
  registeredTime: number;
  modifierName: PolyglotModel;
  modifiedTime: number;
  show: boolean;
}

export function getEmptyNaOffsetElementDetail<T>(): NaOffsetElementDetail<T> {
  return {
    id: '',
    name: '',
    exposureDateOption: false,
    state: '',
    koreanTexts: [],
    englishTexts: [],
    chineseTexts: [],
    startDate: moment().toDate().getTime(),
    endDate: moment().toDate().getTime(),
    registrantName: new PolyglotModel(),
    registeredTime: 0,
    modifierName: new PolyglotModel(),
    modifiedTime: 1581174000000,
    show: false,
  };
}
