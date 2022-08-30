import { PostTypeModel } from './PostTypeModel';

export default interface PostRdo {
  searchFilter: string;
  creatorName?: string;
  startDate: number;
  endDate: number;
  limit: number;
  offset: number;

  postId?: string;
  communityId?: string;
  menuId?: string;
  //type?: PostTypeModel;
  title?: string;
  html?: string;
  likeCount?: number;
  replyCount?: number;
  attchmentCount?: number;
  visible?: boolean;
  creatorId?: string;
  createdTime?: number;
  modifierId?: string;
  modifiedTime?: number;
}
