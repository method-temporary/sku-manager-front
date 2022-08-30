import { observable, action, computed } from 'mobx';
import { Moment } from 'moment';
import _ from 'lodash';
import { NaOffsetElementList, getEmptyNaOffsetElementList } from 'shared/model';
import Post, { getEmptyPost } from '../model/Post';
import { PostQueryModel } from '../model/PostQueryModel';
import PostCdoModel from '../model/PostCdoModel';

class PostStore {
  static instance: PostStore;

  constructor() {
    this.clearPostCdo = this.clearPostCdo.bind(this);
  }

  originData: any = {};

  @observable
  innerPostList: NaOffsetElementList<Post> = getEmptyNaOffsetElementList();

  @action
  setPostList(next: NaOffsetElementList<Post>) {
    this.innerPostList = next;
  }

  @computed
  get postList() {
    return this.innerPostList;
  }

  @observable
  innerSelected: Post = getEmptyPost();

  @action
  select(next: Post) {
    this.innerSelected = next;
  }

  @computed
  get selected() {
    return this.innerSelected;
  }

  @observable
  postQuery: PostQueryModel = new PostQueryModel();

  @action
  clearPostQuery() {
    this.postQuery = new PostQueryModel();
  }

  @action
  setPostQuery(query: PostQueryModel, name: string, value: string | Moment | number | undefined) {
    this.postQuery = _.set(query, name, value);
  }

  @computed
  get selectedPostQuery() {
    return this.postQuery;
  }

  @observable
  postCdo: PostCdoModel = new PostCdoModel();

  @action
  clearPostCdo() {
    this.postCdo = new PostCdoModel();
  }

  @action
  setPostCdo(query: PostCdoModel, name: string, value: string | Moment | number | undefined) {
    this.postCdo = _.set(query, name, value);
  }

  @action
  selectPostCdo(next: PostCdoModel) {
    this.postCdo = next;
  }

  @computed
  get selectedPostCdo() {
    return this.postCdo;
  }

  @action
  setOriginData(next: any) {
    this.originData = { ...next };
  }

  @action
  getOriginData() {
    return this.originData;
  }
  // @action
  // changePostQueryProps(
  //   name: string,
  //   value: string | Moment | number | undefined
  // ) {
  //   //
  //   // if (name === 'college' && value === '전체') {
  //   //   this.postQuery = _.set(this.postQuery, name, '');
  //   //   this.postQuery = _.set(this.postQuery, 'channel', '');
  //   // }
  //   if (value === '전체') value = '';
  //   //this.postQuery = _.set(this.postQuery, name, value);
  //   console.log(this.selected);
  // }
}

PostStore.instance = new PostStore();

export default PostStore;
