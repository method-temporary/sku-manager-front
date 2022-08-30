import { NaOffsetElementList, getEmptyNaOffsetElementList } from 'shared/model';
import { createStore } from './Store';
import Skill from '../model/Skill';

const skillStore: NaOffsetElementList<Skill> = getEmptyNaOffsetElementList();

const [setList, onList, getList, useList] = createStore(skillStore);
const [setSearched, onSearched] = createStore(false);

export { setList, onList, getList, useList, setSearched, onSearched };
