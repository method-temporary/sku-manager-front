import { axiosApi as axios } from 'shared/axios/Axios';
import { BoardModel } from '../../model/BoardModel';

export default class BoardApi {
  URL = '/api/cube/boards';

  static instance: BoardApi;

  registerBoard(board: BoardModel) {
    return axios.post<string>(this.URL, board).then((response) => (response && response.data) || null);
  }

  findBoard(boardId: string) {
    //
    return axios.get<BoardModel>(this.URL + `/${boardId}`).then((response) => (response && response.data) || null);
  }
}

Object.defineProperty(BoardApi, 'instance', {
  value: new BoardApi(),
  writable: false,
  configurable: false,
});
