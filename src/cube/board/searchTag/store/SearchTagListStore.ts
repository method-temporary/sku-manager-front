import { NaOffsetElementList, getEmptyNaOffsetElementList } from 'shared/model';
import SearchTag, { SearchTagViewModel } from '../model/SearchTag';
import { createStore } from './Store';

const initialStore: NaOffsetElementList<SearchTagViewModel> = getEmptyNaOffsetElementList();

const [setList, onList] = createStore(initialStore);
const [setSearched, onSearched] = createStore(false);

export { setList, onList, setSearched, onSearched };
