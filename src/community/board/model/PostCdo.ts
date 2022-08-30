import { IdName, NewDatePeriod, PatronKey } from 'shared/model';

import { WriterModel } from '../../../cube/board/post/model/WriterModel';
import { PostContentsModel } from './PostContentsModel';
import { PostConfigModel } from './PostCofigModel';
import { OpenState } from './OpenState';

export class PostCdo {
  //
  id: string = '';
  entityVersion: number = 0;

  postId: string = '';
  title: string = '';
  writer: WriterModel = new WriterModel();
  contents: PostContentsModel = new PostContentsModel();
  time: number = 0;
  readCount: number = 0;
  config: PostConfigModel = new PostConfigModel();
  category: IdName = new IdName();
  boardId: string = '';
  pinned: boolean = false;
  deleted: boolean = false;
  answered: boolean = false;
  answeredAt: number = 0;
  answerUpdatedAt: number = 0;
  answer: IdName = new IdName();
  openState: OpenState = OpenState.Created;
  commentFeedbackId: string = '';

  period: NewDatePeriod = new NewDatePeriod();

  patronKey: PatronKey = {} as PatronKey;
}
