import { axiosApi as axios } from 'shared/axios/Axios';
import { NameValueList, OffsetElementList } from 'shared/model';
import { setExcelHistoryParams } from 'shared/components/SubActions/sub/ExcelButton/store/ExcelHistoryStore';
import { PostModel } from '../../model/PostModel';
import { PostRdoModel } from '../../model/PostRdoModel';
import { PostCdo } from '../../model/PostCdo';
import AttendanceView from '../../model/AttendanceView';

export default class PostApi {
  URL = '/api/board/posts/admin';

  static instance: PostApi;

  registerPost(postCdo: PostCdo) {
    //
    // console.log(postCdo);
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
    if (postRdo.companyCode === 'All') {
      postRdo.companyCode = '';
    }
    return axios
      .getLoader<OffsetElementList<PostModel>>(this.URL + `/searchKey?boardId=${boardId}`, { params: postRdo })
      .then(
        (response: any) =>
          (response && response.data && new OffsetElementList<PostModel>(response.data)) ||
          new OffsetElementList<PostModel>()
      );
  }

  findPostsByBoardIdAndDefaultPeriod(boardId: string, offset: number, limit: number) {
    //
    return axios
      .getLoader<OffsetElementList<PostModel>>(this.URL + `/default?boardId=${boardId}&offset=${offset}&limit=${limit}`)
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

  findAllQnaExcel(postRdo: PostRdoModel) {
    if (postRdo.companyCode === 'All') {
      postRdo.companyCode = '';
    }

    const apiUrl = this.URL + `/excel?boardId=QNA`;

    setExcelHistoryParams({
      searchUrl: apiUrl,
      searchParam: postRdo,
      workType: 'Excel Download',
    });

    return axios.get<PostModel[]>(apiUrl, { params: postRdo }).then((response: any) => {
      return response && response.data && response.data.results.map((qna: PostModel) => new PostModel(qna));
    });
  }

  findAllCallExcel(postRdo: PostRdoModel) {
    if (postRdo.companyCode === 'All') {
      postRdo.companyCode = '';
    }

    const apiUrl = this.URL + `/excel?boardId=CALL`;

    setExcelHistoryParams({
      searchUrl: apiUrl,
      searchParam: postRdo,
      workType: 'Excel Download',
    });

    return axios.get<PostModel[]>(apiUrl, { params: postRdo }).then((response: any) => {
      return response && response.data && response.data.results.map((call: PostModel) => new PostModel(call));
    });
  }

  findAttend(emailId: string) {
    //
    return axios
      .post<AttendanceView>(`/api/event/attend/attendance/byEmail`, {
        email: emailId,
      })
      .then(
        (response: any) =>
          response && response.data && response.data.map((call: AttendanceView) => new AttendanceView(call))
      );
  }

  findAllAttendExcel() {
    const apiUrl = `/api/event/attend/attendance/excel`;

    setExcelHistoryParams({
      searchUrl: apiUrl,
      searchParam: 'None Param',
      workType: 'Excel Download',
    });

    return axios.get<AttendanceView[]>(apiUrl).then((response: any) => {
      return (
        response && response.data && response.data.map((attendance: AttendanceView) => new AttendanceView(attendance))
      );
    });
  }
}

Object.defineProperty(PostApi, 'instance', {
  value: new PostApi(),
  writable: false,
  configurable: false,
});
