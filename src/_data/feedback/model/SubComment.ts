import { EmbeddedSubCommentList } from './EmbeddedSubCommentList';
import { IdName, LangStrings, PatronKey } from '@nara.platform/accent';
import { TaggedUser } from './TaggedUser';

export interface SubComment {
  base64AttachedImage: string;
  commentId: string;
  companyName: string;
  deleted: boolean;
  deletedTime: number;
  deleter: IdName;
  departmentName: string;
  email: string;
  id: string;
  likeCount: number;
  message: string;
  names: LangStrings;
  patronKey: PatronKey;
  secreted: boolean;
  taggedUsers: TaggedUser[];
  time: number;
}
