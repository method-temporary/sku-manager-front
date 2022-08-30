// import { axiosApi as axios, NameValueList } from '@nara.platform/accent';
// import { PostModel } from '../../model/PostModel';
// import { PostBodyModel } from '../../model/PostBodyModel';
//
// export default class PostApi {
//   URL = '/api/cube/Posts';
//   subURL = '/api/cube/PostBodys';
//
//   static instance: PostApi;
//
//   registerPost(post: PostModel) {
//     return axios.post<string>(this.URL, post)
//       .then(response => response && response.data || null);
//   }
//
//   findPost(PostId: string) {
//     //
//     return axios.get<PostModel>(this.URL + `/${PostId}`)
//       .then(response => response && response.data || null);
//   }
//
//   findAllPosts(offset: number = 0, limit: number = 100) {
//     //
//     return axios.get<PostModel[]>(this.URL + `?offset=${offset}&limit=${limit}`)
//       .then(response => response && response.data || null);
//   }
//
//   modifyPost(PostId: string, nameValues: NameValueList) {
//     //
//     return axios.put<void>(this.URL + `/${PostId}`, nameValues);
//   }
//
//   removePost(PostId: string) {
//     //
//     return axios.delete(this.URL + `/${PostId}`);
//   }
//
//   registerPostBody(postBody: PostBodyModel) {
//     return axios.post<string>(this.subURL, postBody)
//       .then(response => response && response.data || null);
//   }
//
//   findPostBody(postBodyId: string) {
//     //
//     return axios.get<PostBodyModel>(this.subURL + `/${postBodyId}`)
//       .then(response => response && response.data || null);
//   }
//
//   findAllPostBodys(offset: number = 0, limit: number = 100) {
//     //
//     return axios.get<PostBodyModel[]>(this.subURL + `?offset=${offset}&limit=${limit}`)
//       .then(response => response && response.data || null);
//   }
//
//   modifyPostBody(postBodyId: string, nameValues: NameValueList) {
//     //
//     return axios.put<void>(this.subURL + `/${postBodyId}`, nameValues);
//   }
//
//   removePostBody(postBodyId: string) {
//     //
//     return axios.delete(this.subURL + `/${postBodyId}`);
//   }
// }
//
// Object.defineProperty(PostApi, 'instance', {
//   value: new PostApi(),
//   writable: false,
//   configurable: false,
// });
