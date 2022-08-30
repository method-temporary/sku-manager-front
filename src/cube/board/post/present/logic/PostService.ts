import autobind from 'autobind-decorator';
import { action, observable, runInAction } from 'mobx';
import { Moment } from 'moment';
import _ from 'lodash';

import { NameValueList, OffsetElementList, PolyglotModel } from 'shared/model';

import { PostModel } from '../../model/PostModel';
import PostApi from '../apiclient/PostApi';
import { PostQueryModel } from '../../model/PostQueryModel';
import { PostContentsModel } from '../../model/PostContentsModel';
import PostStore from '../../../../../community/post/mobx/PostStore';
import { CubeState } from '../../../../cube/model/vo/CubeState';
import AttendanceView from '../../model/AttendanceView';

@autobind
export default class PostService {
  //
  static instance: PostService;

  postApi: PostApi;

  @observable
  post: PostModel = new PostModel();

  @observable
  posts: OffsetElementList<PostModel> = new OffsetElementList<PostModel>();

  @observable
  notices = new OffsetElementList<PostModel>();

  @observable
  faqs = new OffsetElementList<PostModel>();

  @observable
  qnas = new OffsetElementList<PostModel>();

  @observable
  calls = new OffsetElementList<PostModel>();

  @observable
  postQuery: PostQueryModel = new PostQueryModel();

  @observable
  qnaForExcel: PostModel[] = [];

  @observable
  callForExcel: PostModel[] = [];

  constructor(postApi: PostApi) {
    //
    this.postApi = postApi;
  }

  registerPost(post: PostModel) {
    //
    post = _.set(post, 'audienceKey', 'r2p8-r@nea-m5-c5');
    return this.postApi.registerPost(PostModel.asCdo(post));
  }

  registerCallPost(post: PostModel) {
    //
    post = _.set(post, 'audienceKey', 'r2p8-r@nea-m5-c5');
    return this.postApi.registerPost(PostModel.asCallCdo(post));
  }

  @action
  async findPostByPostId(postId: string) {
    const postStore = PostStore.instance;
    //
    const post = await this.postApi.findPostByPostId(postId);

    postStore.setOriginData(post);

    // console.log(post);
    return runInAction(() => (this.post = new PostModel(post)));
  }

  @action
  async findPostsByBoardId(boardId: string) {
    //
    const posts = await this.postApi.findPostsByBoardId(boardId);

    return runInAction(() => (this.posts = posts));
  }

  @action
  async findPostsByBoardIdAndDeleted(boardId: string, deleted: boolean) {
    //
    const posts = await this.postApi.findPostsByBoardIdAndDeleted(boardId, deleted);
    return runInAction(() => (this.posts = posts));
  }

  @action
  async findPostsByCategoryId(categoryId: string) {
    //
    const posts = await this.postApi.findPostsByCategoryId(categoryId);
    return runInAction(() => (this.posts = posts));
  }

  @action
  async findAllPosts() {
    //
    const posts = await this.postApi.findAllPosts();
    return runInAction(() => (this.posts = posts));
  }

  @action
  async findPostsByCategoryIdAndDeleted(categoryId: string, deleted: boolean) {
    //
    const posts = await this.postApi.findPostsByCategoryIdAndDeleted(categoryId, deleted);
    return runInAction(() => (this.posts = posts));
  }

  @action
  clearPost() {
    //
    this.post = {} as PostModel;
  }

  @action
  initPostContents() {
    //
    this.post.contents = new PostContentsModel();
  }

  @action
  initPostQuery() {
    //
    this.postQuery = new PostQueryModel();
  }

  modifyPost(postId: string, post: PostModel) {
    //
    return this.postApi.modifyPost(postId, PostModel.asNameValueList(post));
  }

  modifyCallPost(postId: string, nameValueList: NameValueList) {
    //
    return this.postApi.modifyPost(postId, nameValueList);
  }

  removePost(postId: string, nameValues: NameValueList) {
    //
    this.postApi.removePost(postId, nameValues);
  }

  @action
  changePostProps(name: string, value: string | PolyglotModel | PostContentsModel) {
    //
    this.post = _.set(this.post, name, value);
  }

  @action
  changePostPeriodProps(name: string, value: string | Moment | number) {
    //
    this.post = _.set(this.post, name, value);
  }

  @action
  setDefaultProps() {
    //
    this.post = _.set(this.post, 'openState', CubeState.Created);
  }

  @action
  initPost() {
    //
    this.post = new PostModel();
  }

  @action
  async findPostsForAdminByQuery(boardId: string) {
    //
    const response = await this.postApi.findPostsForAdminByQuery(boardId, PostQueryModel.asPostRdo(this.postQuery));
    const responseResult = response.results.map((post: PostModel) => new PostModel(post));
    runInAction(() => {
      this.posts.results = responseResult;
      this.posts.totalCount = response.totalCount;
    });
    return response;
  }

  @action
  async findNoticesForAdminByQuery(boardId: string) {
    const response = await this.postApi.findPostsForAdminByQuery(boardId, PostQueryModel.asPostRdo(this.postQuery));
    const responseResult = response.results.map((post: PostModel) => new PostModel(post));
    runInAction(() => {
      this.notices.results = responseResult;
      this.notices.totalCount = response.totalCount;
    });
    return response;
  }

  @action
  async findFaqsForAdminByQuery(boardId: string) {
    const response = await this.postApi.findPostsForAdminByQuery(boardId, PostQueryModel.asPostRdo(this.postQuery));
    const responseResult = response.results.map((post: PostModel) => new PostModel(post));
    runInAction(() => {
      this.faqs.results = responseResult;
      this.faqs.totalCount = response.totalCount;
    });
    return response;
  }

  @action
  async findQnasForAdminByQuery(boardId: string, companyCode?: string) {
    const response = await this.postApi.findPostsForAdminByQuery(
      boardId,
      PostQueryModel.asPostRdo(this.postQuery, companyCode)
    );
    const responseResult = response.results.map((post: PostModel) => new PostModel(post));
    runInAction(() => {
      this.qnas.results = responseResult;
      this.qnas.totalCount = response.totalCount;
    });
    return response;
  }

  @action
  async findCallsForAdminByQuery(boardId: string) {
    const response = await this.postApi.findPostsForAdminByQuery(boardId, PostQueryModel.asPostRdo(this.postQuery));
    const responseResult = response.results.map((post: PostModel) => new PostModel(post));
    runInAction(() => {
      this.calls.results = responseResult;
      this.calls.totalCount = response.totalCount;
    });
    return response;
  }

  @action
  async findPostsByBoardIdAndDefaultPeriod(boardId: string, offset: number, limit: number) {
    //
    const response = await this.postApi.findPostsByBoardIdAndDefaultPeriod(boardId, offset, limit);
    const responseResult = response.results.map((post: PostModel) => new PostModel(post));
    runInAction(() => {
      this.posts.results = responseResult;
      this.posts.totalCount = response.totalCount;
    });
    return response;
  }

  @action
  async findNoticesByBoardIdAndDefaultPeriod(boardId: string, offset: number, limit: number) {
    const response = await this.postApi.findPostsByBoardIdAndDefaultPeriod(boardId, offset, limit);
    const responseResult = response.results.map((post: PostModel) => new PostModel(post));
    runInAction(() => {
      this.notices.results = responseResult;
      this.notices.totalCount = response.totalCount;
    });
    return response;
  }

  @action
  async findFaqsByBoardIdAndDefaultPeriod(boardId: string, offset: number, limit: number) {
    const response = await this.postApi.findPostsByBoardIdAndDefaultPeriod(boardId, offset, limit);
    const responseResult = response.results.map((post: PostModel) => new PostModel(post));
    runInAction(() => {
      this.faqs.results = responseResult;
      this.faqs.totalCount = response.totalCount;
    });
    return response;
  }

  @action
  async findQnasByBoardIdAndDefaultPeriod(boardId: string, offset: number, limit: number) {
    const response = await this.postApi.findPostsByBoardIdAndDefaultPeriod(boardId, offset, limit);
    const responseResult = response.results.map((post: PostModel) => new PostModel(post));
    runInAction(() => {
      this.qnas.results = responseResult;
      this.qnas.totalCount = response.totalCount;
    });
    return response;
  }

  @action
  async findCallsByBoardIdAndDefaultPeriod(boardId: string, offset: number, limit: number) {
    const response = await this.postApi.findPostsByBoardIdAndDefaultPeriod(boardId, offset, limit);
    const responseResult = response.results.map((post: PostModel) => new PostModel(post));
    runInAction(() => {
      this.calls.results = responseResult;
      this.calls.totalCount = response.totalCount;
    });
    return response;
  }

  @action
  changePostQueryProps(name: string, value: string | Moment | number) {
    this.postQuery = _.set(this.postQuery, name, value);
  }

  @action
  clearPostQuery() {
    //
    this.postQuery = new PostQueryModel();
  }

  @action
  async findAllQnaForExcel() {
    //
    const qnas = await this.postApi.findAllQnaExcel(PostQueryModel.asPostRdo(this.postQuery));
    runInAction(() => (this.qnaForExcel = qnas));
    return qnas;
  }

  @action
  async findAllCallForExcel() {
    //
    const call = await this.postApi.findAllCallExcel(PostQueryModel.asPostRdo(this.postQuery));
    runInAction(() => (this.callForExcel = call));
    return call;
  }

  @observable
  attendances: OffsetElementList<AttendanceView> = new OffsetElementList<AttendanceView>();

  @observable
  attendancesExcel: AttendanceView[] = [];

  @action
  async findAttend() {
    //
    const response = await this.postApi.findAttend(this.postQuery.searchWord);
    const responseResult = response.map((post: AttendanceView) => new AttendanceView(post));
    runInAction(() => {
      this.attendances.results = responseResult;
      this.attendances.totalCount = responseResult.length;
    });
    return response;
  }

  @action
  async findAllAttendExcel() {
    //
    const attendances = await this.postApi.findAllAttendExcel();
    runInAction(() => (this.attendancesExcel = attendances));
    return attendances;
  }

  @action
  clearResult() {
    //
    this.posts = new OffsetElementList<PostModel>();
  }
}

Object.defineProperty(PostService, 'instance', {
  value: new PostService(PostApi.instance),
  writable: false,
  configurable: false,
});
