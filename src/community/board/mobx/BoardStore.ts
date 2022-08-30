import { observable, action, computed } from 'mobx';
import { Moment } from 'moment';
import _ from 'lodash';
import { NaOffsetElementList, getEmptyNaOffsetElementList } from 'shared/model';
import Board, { getEmptyBoard } from '../model/Board';
import { BoardQueryModel } from '../model/BoardQueryModel';
//import BoardCdo, { getFromBoard } from '../model/BoardCdo';
import BoardCdoModel from '../model/BoardCdoModel';
import PostModel from '../model/PostModel';

class BoardStore {
  static instance: BoardStore;

  @observable
  innerBoardList: NaOffsetElementList<Board> = getEmptyNaOffsetElementList();

  @action
  setBoardList(next: NaOffsetElementList<Board>) {
    this.innerBoardList = next;
  }

  @computed
  get boardList() {
    return this.innerBoardList;
  }

  @observable
  innerSelected: Board = getEmptyBoard();

  @action
  select(next: Board) {
    this.innerSelected = next;
  }

  @computed
  get selected() {
    return this.innerSelected;
  }

  @observable
  postModel: PostModel = new PostModel();

  @action
  selectPost(next: PostModel) {
    this.postModel = next;
  }

  @action
  setPostCdo(query: PostModel, name: string, value: string | Moment | number | undefined) {
    this.postModel = _.set(query, name, value);
  }

  @computed
  get selectedPost() {
    return this.postModel;
  }

  @observable
  boardQuery: BoardQueryModel = new BoardQueryModel();

  @action
  clearBoardQuery() {
    this.boardQuery = new BoardQueryModel();
  }

  @action
  setBoardQuery(query: BoardQueryModel, name: string, value: string | Moment | number | undefined) {
    this.boardQuery = _.set(query, name, value);
  }

  @computed
  get selectedBoardQuery() {
    return this.boardQuery;
  }

  // @observable
  // boardCdo: BoardCdo = getFromBoard();

  // @action
  // clearBoardCdo() {
  //   this.boardCdo = getFromBoard();
  // }

  @observable
  boardCdo: BoardCdoModel = new BoardCdoModel();

  @action
  clearBoardCdo() {
    this.boardCdo = new BoardCdoModel();
  }

  @action
  setBoardCdo(query: BoardCdoModel, name: string, value: string | Moment | number | undefined) {
    this.boardCdo = _.set(query, name, value);
  }

  @computed
  get selectedBoardCdo() {
    return this.boardCdo;
  }

  // @action
  // changeBoardQueryProps(
  //   name: string,
  //   value: string | Moment | number | undefined
  // ) {
  //   //
  //   // if (name === 'college' && value === 'All') {
  //   //   this.boardQuery = _.set(this.boardQuery, name, '');
  //   //   this.boardQuery = _.set(this.boardQuery, 'channel', '');
  //   // }
  //   if (value === 'All') value = '';
  //   //this.boardQuery = _.set(this.boardQuery, name, value);
  //   console.log(this.selected);
  // }
}

BoardStore.instance = new BoardStore();

export default BoardStore;
