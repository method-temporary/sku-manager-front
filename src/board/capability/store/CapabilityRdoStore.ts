import moment from 'moment';
import CapabilityRdo from '../model/CapabilityRdo';
import { createStore } from './Store';

export type SEARCH_TYPE = 'TEXT' | 'TAG' | 'KEYWORDS' | 'CREATOR' | 'UPDATER';
export type COMPETENCY_TYPE = 'DT' | 'AI';

const [setStartDate, onStartDate, getStartDate] = createStore(
  moment().startOf('day').subtract(1, 'year').date()
);
const [setEndDate, onEndDate, getEndDate] = createStore(
  moment().endOf('day').date()
);
const [setTag, onTag, getTag] = createStore('');
const [setKeywords, onKeywords, getKeywords] = createStore('');
const [setCreator, onCreator, getCreator] = createStore('');
const [setUpdater, onUpdater, getUpdater] = createStore('');
const [setText, onText, getText] = createStore('');
const [setLimit, onLimit, getLimit] = createStore(20);
const [setOffset, onOffset, getOffset] = createStore(0);
const [setSearchType, onSearchType, getSearchType] = createStore<SEARCH_TYPE>(
  'TEXT'
);
const [setCapabilityType, onCapabilityType, getCapabilityType] = createStore<
  COMPETENCY_TYPE
>('DT');

function getCapabilityRdo(): CapabilityRdo {
  return {
    startDate: getStartDate() || 0,
    endDate: getEndDate() || 0,
    tag: getTag() || '',
    keywords: getKeywords() || '',
    creator: getCreator() || '',
    updater: getUpdater() || '',
    text: getText() || '',
    limit: getLimit() || 0,
    offset: getOffset() || 0,
    searchType: getSearchType() || 'TEXT',
    capabilityType: getCapabilityType() || 'DT',
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
  setCapabilityType,
  onCapabilityType,
  getCapabilityType,
  getCapabilityRdo,
};
