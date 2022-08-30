import { NaOffsetElementList, getEmptyNaOffsetElementList } from 'shared/model';
import Competency, { CompetencyViewModel } from '../model/Competency';
import { createStore } from './Store';

const initialStore: NaOffsetElementList<CompetencyViewModel> = getEmptyNaOffsetElementList();

const [setList, onList, getList, useList] = createStore(initialStore);
const [setSearched, onSearched] = createStore(false);

export { setList, onList, getList, useList, setSearched, onSearched };
