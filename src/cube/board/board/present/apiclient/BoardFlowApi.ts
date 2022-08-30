import { axiosApi as axios } from 'shared/axios/Axios';

export default class BoardFlowApi {
  URL = '/api/cube/boards/flow';

  static instance: BoardFlowApi;

  // makeBoard(board: BoardFlowCdoModel) {
  //   return axios
  //     .post<string>(this.URL, board)
  //     .then((response) => (response && response.data) || null)
  //     .catch((reason) => {
  //       // console.log(reason);
  //     });
  // }
  //
  // modSuperBoard(cubeId: string, boardFlowUdo: BoardFlowUdoModel) {
  //   return axios.put<void>(this.URL + `/approved/${cubeId}`, boardFlowUdo);
  // }
  //
  // modifyBoard(cubeId: string, boardFlowUdo: BoardFlowUdoModel) {
  //   //
  //   return axios.put<void>(this.URL + `/${cubeId}`, boardFlowUdo);
  // }
  //
  // makeBoardByUserVer(boardFlowUserCdo: BoardFlowUserCdo) {
  //   //
  //   return axios.post<void>(this.URL + `/byUser`, boardFlowUserCdo);
  // }

  removeBoard(cubeId: string) {
    //
    return axios.delete(this.URL + `/${cubeId}`);
  }
}

Object.defineProperty(BoardFlowApi, 'instance', {
  value: new BoardFlowApi(),
  writable: false,
  configurable: false,
});
