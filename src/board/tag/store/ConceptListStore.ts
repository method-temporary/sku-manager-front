import { NaOffsetElementList, getEmptyNaOffsetElementList } from 'shared/model';
import { createStore } from './Store';
import Term from '../model/Term';

const termStore: NaOffsetElementList<Term> = getEmptyNaOffsetElementList();

const [setList, onList, getList, useList] = createStore(termStore);
const [setSearched, onSearched] = createStore(false);

export { setList, onList, getList, useList, setSearched, onSearched };
