import moment from 'moment';
import SearchTagRdo from '../model/SearchTagRdo';
import { createStore } from './Store';

export type SEARCH_TYPE = 'TEXT' | 'TAG' | 'KEYWORDS' | 'CREATOR' | 'UPDATER';

const [setStartDate, onStartDate, getStartDate] = createStore(moment().startOf('day').subtract(1, 'year').date());
const [setEndDate, onEndDate, getEndDate] = createStore(moment().endOf('day').date());
const [setTag, onTag, getTag] = createStore('');
const [setKeywords, onKeywords, getKeywords] = createStore('');
const [setCreator, onCreator, getCreator] = createStore('');
const [setUpdater, onUpdater, getUpdater] = createStore('');
const [setText, onText, getText] = createStore('');
const [setLimit, onLimit, getLimit] = createStore(20);
const [setOffset, onOffset, getOffset] = createStore(0);
const [setSearchType, onSearchType, getSearchType] = createStore<SEARCH_TYPE>('TEXT');

function getSearchTagRdo(): SearchTagRdo {
  return {
    startDate: getStartDate(),
    endDate: getEndDate(),
    tag: getTag(),
    keywords: getKeywords(),
    creator: getCreator(),
    modifier: getUpdater(),
    text: getText(),
    limit: getLimit(),
    offset: getOffset(),
    searchType: getSearchType(),
  };
}

export {
  setStartDate,
  onStartDate,
  getStartDate,
  setEndDate,
  onEndDate,
  getEndDate,
  setTag,
  onTag,
  getTag,
  setKeywords,
  onKeywords,
  getKeywords,
  setCreator,
  onCreator,
  getCreator,
  setUpdater,
  onUpdater,
  getUpdater,
  setText,
  onText,
  getText,
  setLimit,
  onLimit,
  getLimit,
  setOffset,
  onOffset,
  getOffset,
  setSearchType,
  onSearchType,
  getSearchType,
  getSearchTagRdo,
};
