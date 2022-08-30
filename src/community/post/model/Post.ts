import { PostTypeModel } from './PostTypeModel';
import MenuType from 'community/menu/model/MenuType';

export default interface Post {
  postId?: string;
  communityId?: string;
  menuId?: string;
  menuName?: string;
  postType?: PostTypeModel;
  title?: string;
  html?: string;
  likeCount?: number;
  replyCount?: number;
  attchmentCount?: number;
  visible?: boolean;
  pinned?: boolean;
  creatorId?: string;
  creatorName?: string;
  createdTime?: number;
  modifierId?: string;
  modifiedTime?: number;
  menuType?: MenuType;
  nickName?: string;
  creatorEmail?: string;
}

export function getEmptyPost(): Post {
  return {};
}
