import { EmbeddedSubCommentList } from './EmbeddedSubCommentList';
import { IdName, PatronKey } from '@nara.platform/accent';
import { LangStrings } from 'shared/model';
import { TaggedUser } from './TaggedUser';
import { SubComment } from './SubComment';

export interface Comment {
  base64AttachedImage: string;
  companyName: string;
  deleted: boolean;
  deletedTime: number;
  deleter: IdName;
  departmentName: string;
  email: string;
  embeddedSubComments: EmbeddedSubCommentList;
  feedbackId: string;
  id: string;
  important: boolean;
  likeCount: number;
  message: string;
  names: LangStrings;
  patronKey: PatronKey;
  pinned: boolean;
  secreted: boolean;
  subCommentCount: number;
  subComments: SubComment[];
  taggedUsers: TaggedUser[];
  time: number;
}
