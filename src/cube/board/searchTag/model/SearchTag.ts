import moment from 'moment';

import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import SearchTag from '../ui/logic/SearchTag';
import Creator from './Creator';

export default interface SearchTag {
  id: string;
  tag: string;
  keywords: string;
  registrant: Creator;
  modifier: Creator;
  registeredTime: number;
  modifiedTime: number;
}

export interface SearchTagViewModel extends SearchTag {
  checked?: boolean;
}

export interface SearchTagExcel {
  No: string;
  Tag: string;
  유사어: string;
  '수정/등록일': string;
  생성자: string;
  최종업데이트: string;
}

function timeToDateString(time: number) {
  return moment(time).format('YYYY.MM.DD');
}

export function convertToExcel(searchTags: SearchTag[]): SearchTagExcel[] {
  let no = 1;
  return searchTags.map(({ tag, keywords, registrant, modifier, registeredTime, modifiedTime }) => {
    return {
      No: `${no++}`,
      Tag: tag,
      유사어: keywords,
      '수정/등록일': timeToDateString(modifier !== null ? modifiedTime : registeredTime),
      생성자: getPolyglotToAnyString(registrant.name),
      최종업데이트: modifier === null ? '' : getPolyglotToAnyString(modifier.name),
    };
  });
}
