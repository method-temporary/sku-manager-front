import { CommentConfig } from './CommentConfig';
import { IdName, PatronKey } from '@nara.platform/accent';

export interface CommentFeedback {
  config: CommentConfig;
  id: string;
  patronKey: PatronKey;
  sourceEntity: IdName;
  time: number;
  title: string;
}
