import { IdName, NewDatePeriod, PatronKey, PolyglotModel } from 'shared/model';
import { DEFAULT_LANGUAGE, LangSupport } from 'shared/components/Polyglot';

import { OpenState } from './OpenState';
import { IdPolyglot } from './IdPolyglot';
import { PostCloseOption } from './PostCloseOption';
import { WriterModel } from './WriterModel';
import { PostConfigModel } from './PostCofigModel';
import { PostContentsModel } from './PostContentsModel';

export class PostCdo {
  //
  id: string = '';
  entityVersion: number = 0;

  postId: string = '';
  title: PolyglotModel = new PolyglotModel();
  writer: WriterModel = new WriterModel();
  contents: PostContentsModel = new PostContentsModel();
  time: number = 0;
  readCount: number = 0;
  config: PostConfigModel = new PostConfigModel();
  category: IdPolyglot = new IdPolyglot();
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

  registeredTime: number = 0;

  langSupports: LangSupport[] = [DEFAULT_LANGUAGE];
  closeOption: PostCloseOption = PostCloseOption.NotToday;
}
