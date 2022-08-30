import { DenizenKey, IdName, LangStrings } from '@nara.platform/accent';
import { TaggedUser } from './TaggedUser';

export interface EmbeddedSubComment {
  base64AttachedImage: string;
  deleted: boolean;
  deletedTime: number;
  deleter: IdName;
  message: string;
  name: LangStrings;
  patronKey: DenizenKey;
  taggedUsers: TaggedUser[];
  time: number;
}
