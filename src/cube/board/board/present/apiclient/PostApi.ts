import { axiosApi as axios, NameValueList } from '@nara.platform/accent';

import { OffsetElementList } from 'shared/model';

import { PostModel } from '../../../post/model/PostModel';
import { PostRdoModel } from '../../../post/model/PostRdoModel';
import { PostCdo } from '../../../post/model/PostCdo';

export default class PostApi {
  URL = '/api/board/posts';

  static instance: PostApi;

  registerPost(postCdo: PostCdo) {
    //
    return axios.post<string>(this.URL, postCdo).then((response) => (response && response.data) || null);
  }

  findPostByPostId(postId: string) {
    //
    return axios.get<PostModel>(this.URL + `/${postId}`).then((response) => (response && response.data) || null);
  }

  findPostsByBoardId(boardId: string, offset: number = 0, limit: number = 20) {
    //
    return axios
      .get<OffsetElementList<PostModel>>(this.URL + `?boardId=${boardId}&offset=${offset}&limit=${limit}`)
      .then((response) => (response && response.data) || null);
  }

  findPostsByBoardIdAndDeleted(boardId: string, deleted: boolean, offset: number = 0, limit: number = 20) {
    //
    return axios
      .get<OffsetElementList<PostModel>>(
        this.URL + `/list?boardId=${boardId}&deleted=${deleted}&offset=${offset}&limit=${limit}`
      )
      .then((response) => (response && response.data) || null);
  }

  findPostsByCategoryId(categoryId: string, offset: number = 0, limit: number = 20) {
    //
    return axios
      .get<OffsetElementList<PostModel>>(
        this.URL + `/category?categoryId=${categoryId}&offset=${offset}&limit=${limit}`
      )
      .then((response) => (response && response.data) || null);
  }

  findPostsByCategoryIdAndDeleted(categoryId: string, deleted: boolean, offset: number = 0, limit: number = 20) {
    //
    return axios
      .get<OffsetElementList<PostModel>>(
        this.URL + `/category-list?categoryId=${categoryId}&deleted=${deleted}&offset=${offset}&limit=${limit}`
      )
      .then((response) => (response && response.data) || null)
      .catch((reason) => reason);
  }

  findAllPosts(offset: number = 0, limit: number = 20) {
    //
    return axios
      .get<OffsetElementList<PostModel>>(this.URL + `?offset=${offset}&limit${limit}`)
      .then((response) => (response && response.data) || null);
  }

  findPostsForAdminByQuery(boardId: string, postRdo: PostRdoModel) {
    //
    return axios
      .get<OffsetElementList<PostModel>>(this.URL + `/searchKey?boardId=${boardId}`, { params: postRdo })
      .then(
        (response: any) =>
          (response && response.data && new OffsetElementList<PostModel>(response.data)) ||
          new OffsetElementList<PostModel>()
      );
  }

  findPostsByBoardIdAndDefaultPeriod(boardId: string, offset: number, limit: number) {
    //
    return axios
      .get<OffsetElementList<PostModel>>(this.URL + `/default?boardId=${boardId}&offset=${offset}&limit=${limit}`)
      .then((response: any) => {
        return (
          (response && response.data && new OffsetElementList<PostModel>(response.data)) ||
          new OffsetElementList<PostModel>()
        );
      });
  }

  modifyPost(postId: string, nameValues: NameValueList) {
    //
    return axios.put<void>(this.URL + `/${postId}`, nameValues);
  }

  removePost(postId: string, nameValues: NameValueList) {
    //
    return axios.put<void>(this.URL + `/${postId}`, nameValues);
  }
}

Object.defineProperty(PostApi, 'instance', {
  value: new PostApi(),
  writable: false,
  configurable: false,
});
