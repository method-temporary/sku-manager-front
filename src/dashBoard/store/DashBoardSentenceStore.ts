import { NaOffsetElementList, getEmptyNaOffsetElementList } from 'shared/model';
import { DashBoardSentenceViewModel } from '_data/arrange/dashboardMessage/model/DashBoardSentenceModel';
import { createStore } from './Store';

const initialStore: NaOffsetElementList<DashBoardSentenceViewModel> = getEmptyNaOffsetElementList();

const [setList, onList, getList] = createStore(initialStore);
const [setSearched, onSearched] = createStore(false);

export { setList, onList, getList, setSearched, onSearched };
