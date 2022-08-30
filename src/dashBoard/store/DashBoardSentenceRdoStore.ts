import moment from 'moment';
import { DashBoardRdoModel } from '_data/arrange/dashboardMessage/model';
import { createStore } from './Store';

export type SEARCH_TYPE = 'All' | 'Opened' | 'Temp' | 'Closed';
export type SEARCH_DATE_TYPE = 'all' | 'show' | 'update';
const [setStartDate, onStartDate, getStartDate] = createStore(moment().startOf('day').subtract(1, 'year').date());
const [setEndDate, onEndDate, getEndDate] = createStore(moment().endOf('day').date());
const [setState, onState, getState] = createStore<SEARCH_TYPE>('All');
const [setShow, onShow, getShow] = createStore<boolean>(true);
const [setKeywords, onKeywords, getKeywords] = createStore('');
const [setTempSave, onTempSave, getTempSave] = createStore('');
const [setExposure, onExposure, getExposure] = createStore('');
const [setNotExposure, onNotExposure, getNotExposure] = createStore('');
const [settSearchWord, ontSearchWord, getSearchWord] = createStore('');
const [setText, onText, getText] = createStore('');
const [setLimit, onLimit, getLimit] = createStore(20);
const [setOffset, onOffset, getOffset] = createStore(0);
const [setDateOption, onDateOption, getDateOption] = createStore<SEARCH_DATE_TYPE>('all');

function getDashBoardSentenceRdo(): DashBoardRdoModel {
  return {
    startDate: getStartDate(),
    endDate: getEndDate(),
    state: getState(),
    show: getShow(),
    keywords: getKeywords(),
    searchWord: getSearchWord(),
    name: getText(),
    limit: getLimit(),
    offset: getOffset(),
    dateOptions: getDateOption(),
  };
}

export {
  setStartDate,
  onStartDate,
  getStartDate,
  setEndDate,
  onEndDate,
  getEndDate,
  setState,
  onState,
  getState,
  setShow,
  onShow,
  getShow,
  setTempSave,
  onTempSave,
  getTempSave,
  setKeywords,
  onKeywords,
  getKeywords,
  setExposure,
  onExposure,
  getExposure,
  setNotExposure,
  onNotExposure,
  getNotExposure,
  settSearchWord,
  ontSearchWord,
  getSearchWord,
  setText,
  onText,
  getText,
  setLimit,
  onLimit,
  getLimit,
  setOffset,
  onOffset,
  getOffset,
  setDateOption,
  onDateOption,
  getDateOption,
  getDashBoardSentenceRdo,
};
