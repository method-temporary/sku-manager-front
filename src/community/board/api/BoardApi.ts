import { NameValueList, axiosApi as axios } from '@nara.platform/accent';
import Board from '../model/Board';
import PostModel from '../model/PostModel';
import BoardCdoModel from '../model/BoardCdoModel';
import BoardRdo from '../model/BoardRdo';

const BASE_URL = '/api/community/posts';
//TODO API 수정 후 변경 예정
const boardId = 'FAQ';

export function findCommunities(limit: number, offset: number): Promise<any> {
  return axios.get<Board[]>(`${BASE_URL}`, {
    params: { limit, offset },
  });
}

export function findAllBoardByQuery(boardRdo: BoardRdo): Promise<any> {
  boardRdo.boardId = 'FAQ';
  return (
    axios
      //.get<Board[]>(`${BASE_URL}` + `/searchKey`, {
      .get<Board[]>(`${BASE_URL}` + `/byBoardId`, {
        params: boardRdo,
      })
  );
}

export function findBoard(boardId: string): Promise<PostModel | undefined> {
  return axios.get<PostModel>(`${BASE_URL}/${boardId}`).then((response) => response && response.data);
}
export function registerBoard(BoardCdoModel: BoardCdoModel): Promise<string> {
  return axios.post<string>(`${BASE_URL}`, BoardCdoModel).then((response) => response && response.data);
}
export function modifyBoard(boardId: string, nameValueList: NameValueList): Promise<any> {
  return axios.put(`${BASE_URL}/${boardId}`, nameValueList);
}
export function removeBoard(boardId: string): Promise<any> {
  return axios.delete(`${BASE_URL}/${boardId}`);
}
