// import { action, observable, runInAction } from 'mobx';
// import autobind from 'autobind-decorator';
// import _ from 'lodash';
// import { NameValueList } from '@nara.platform/accent';
// import { PostModel } from '../../model/PostModel';
// import PostApi from '../apiclient/PostApi';
//
//
// @autobind
// export default class PostService {
//   //
//   static instance: PostService;
//
//   PostApi: PostApi;
//
//   @observable
//   post: PostModel = new PostModel();
//
//   @observable
//   posts: PostModel[] = [];
//
//   constructor(PostApi: PostApi) {
//     this.PostApi = PostApi;
//   }
//
//   registerPost(Post: PostModel) {
//     //
//     Post = _.set(Post, 'audienceKey', 'r2p8-r@nea-m5-c5');
//     return this.PostApi.registerPost(Post);
//   }
//
//   @action
//   async findPost(postId: string) {
//     //
//     const post = await this.PostApi.findPost(postId);
//     return runInAction(() => this.post = new PostModel(post));
//   }
//
//   @action
//   async findAllPosts() {
//     //
//     const posts = await this.PostApi.findAllPosts();
//     return runInAction(() => this.posts = posts.map(post => new PostModel(post)));
//   }
//
//   modifyPost(postId: string, nameValues: NameValueList) {
//     //
//     this.PostApi.modifyPost(postId, nameValues);
//   }
//
//   removePost(postId: string) {
//     //
//     this.PostApi.removePost(postId);
//   }
//
//   @action
//   changePostProps(name: string, value: string) {
//     //
//     this.post = _.set(this.post, name, value);
//   }
// }
//
// Object.defineProperty(PostService, 'instance', {
//   value: new PostService(PostApi.instance),
//   writable: false,
//   configurable: false,
// });
