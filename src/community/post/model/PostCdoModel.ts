import { decorate, observable } from 'mobx';
import { PostTypeModel } from './PostTypeModel';

export default class PostCdoModel {
  postId: string = '';
  communityId: string = '';
  menuId: string = '';
  postType: PostTypeModel = new PostTypeModel();
  title: string = '';
  html: string = '';
  likeCount: number = 0;
  replyCount: number = 0;
  attchmentCount: number = 0;
  visible: boolean = false;
  pinned: boolean = false;
  creatorId: string = '';
  creatorName: string = '';
  createdTime: number = 0;
  modifierId: string = '';
  modifiedTime: number = 0;
  fileBoxId: string = '';
  nickName: string = '';
  static isBlank(postCdo: PostCdoModel): string {
    if (!postCdo.menuId) return '메뉴명';
    if (!postCdo.title) return '제목';
    if (!postCdo.html) return '내용';

    return 'success';
  }
}

decorate(PostCdoModel, {
  postId: observable,
  communityId: observable,
  menuId: observable,
  postType: observable,
  title: observable,
  html: observable,
  likeCount: observable,
  replyCount: observable,
  attchmentCount: observable,
  visible: observable,
  pinned: observable,
  creatorId: observable,
  creatorName: observable,
  createdTime: observable,
  modifierId: observable,
  modifiedTime: observable,
  fileBoxId: observable,
});
