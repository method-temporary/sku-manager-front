import { PostBody } from './PostBody';
import { IdName } from '@nara.platform/accent';

export interface Post {
  boardId: string;
  commentFeedbackId: string;
  deleted: boolean;
  pinned: number;
  postBody: PostBody;
  readCount: number;
  registeredTime: number;
  replies: IdName[];
  title: string;
  writer: string;
}
