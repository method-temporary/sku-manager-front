import { createStore } from './Store';
import { SearchBox } from '../viewModel/SearchBox';

// 전체멤버 조회
const [setSearchBox, onSearchBox, getSearchBox, useSearchBox] = createStore<
  SearchBox
>();

export { setSearchBox, onSearchBox, getSearchBox, useSearchBox };
