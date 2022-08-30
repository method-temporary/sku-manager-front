import { action, observable, runInAction } from 'mobx';
import autobind from 'autobind-decorator';
import _ from 'lodash';
import { Moment } from 'moment';
import BoardApi from '../apiclient/BoardApi';
import BoardFlowApi from '../apiclient/BoardFlowApi';
import { BoardModel } from '../../model/BoardModel';

@autobind
export default class BoardService {
  //
  static instance: BoardService;

  boardApi: BoardApi;
  boardFlowApi: BoardFlowApi;

  @observable
  board: BoardModel = new BoardModel();

  @observable
  boards: BoardModel[] = [];

  constructor(boardApi: BoardApi, boardFlowApi: BoardFlowApi) {
    this.boardApi = boardApi;
    this.boardFlowApi = boardFlowApi;
  }

  registerBoard(board: BoardModel) {
    //
    board = _.set(board, 'audienceKey', 'r2p8-r@nea-m5-c5');
    return this.boardApi.registerBoard(board);
  }

  @action
  async findBoard(boardId: string) {
    //
    const board = await this.boardApi.findBoard(boardId);
    return runInAction(() => (this.board = new BoardModel(board)));
  }

  @action
  changeBoardProps(name: string, value: string | Moment | boolean) {
    //
    this.board = _.set(this.board, name, value);
  }

  @action
  clearBoard() {
    //
    this.board = new BoardModel();
  }

  @action
  setBoard(board: BoardModel): void {
    this.board = board;
  }
}

Object.defineProperty(BoardService, 'instance', {
  value: new BoardService(BoardApi.instance, BoardFlowApi.instance),
  writable: false,
  configurable: false,
});
