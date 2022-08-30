import { axiosApi as axios } from 'shared/axios/Axios';
import Post from '../model/Post';
import PostCdoModel from '../model/PostCdoModel';
import PostRdo from '../model/PostRdo';
import { setExcelHistoryParams } from 'shared/components/SubActions/sub/ExcelButton/store/ExcelHistoryStore';

const BASE_URL = '/api/community/communities';
const BASE_URL2 = '/api/community/postviews';
//const communityId = 'd2497f9f-516b-4505-a73e-01a2cb2deaf5';
//const menuId = 'da604839-ca9f-48aa-b8e8-7bc555ec4b74';
//const postId = '34d2ffdf-faa9-48d8-8d0b-fb9b1f982756';

export function findCommunities(limit: number, offset: number): Promise<any> {
  return axios.get<Post[]>(`${BASE_URL}`, {
    params: { limit, offset },
  });
}

export function findAllPostByQuery(postRdo: PostRdo): Promise<any> {
  const apiUrl = `${BASE_URL2}/communities/${postRdo.communityId}/posts`;

  setExcelHistoryParams({
    searchUrl: apiUrl,
    searchParam: postRdo,
    workType: 'Excel Download',
  });

  return (
    axios
      //.get<Post[]>(`${BASE_URL}` + `/searchKey`, {
      .get<Post[]>(apiUrl, {
        params: postRdo,
      })
  );
}

export function findAllPostByQueryForExcel(postRdo: PostRdo): Promise<any> {
  const apiUrl = `${BASE_URL2}/communities/${postRdo.communityId}/posts/forExcel`;

  setExcelHistoryParams({
    searchUrl: apiUrl,
    searchParam: postRdo,
    workType: 'Excel Download',
  });

  return (
    axios
      //.get<Post[]>(`${BASE_URL}` + `/searchKey`, {
      .get<Post[]>(apiUrl, {
        params: postRdo,
      })
  );
}

export function findPost(communityId: string, postId: string): Promise<PostCdoModel | undefined> {
  return axios.get<PostCdoModel>(`${BASE_URL2}/post/${postId}`).then((response) => response && response.data);
}
export function registerPost(postCdoModel: PostCdoModel): Promise<string> {
  return axios
    .post<string>(`${BASE_URL}/${postCdoModel.communityId}/posts/flow`, postCdoModel)
    .then((response) => response && response.data);
}
export function modifyPost(postId: string, postCdoModel: PostCdoModel): Promise<string> {
  return axios
    .put<string>(`${BASE_URL}/${postCdoModel.communityId}/posts/${postId}`, postCdoModel)
    .then((response) => response && response.data);
}

// export function findPostByName(
//   postName: string
// ): Promise<PostCdoModel | undefined> {
//   return axios
//     .get<PostCdoModel>(`${BASE_URL}/checkByName/${postName}`)
//     .then((response) => response && response.data);
// }

export function removePost(communityId: string, postId: string): Promise<any> {
  return axios.delete(`${BASE_URL}/${communityId}/posts/flow/${postId}`);
}
