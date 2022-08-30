import { IdName } from 'shared/model';
import { RollBookModel } from '../../rollBook/model/RollBookModel';

export class LectureCardCdoModel {
  //
  audienceKey: string = 'r2p8-r@nea-m5-c5';

  learningCard: IdName = new IdName();
  rollBooks: RollBookModel[] = [];
  round: number = 0;
  reviewFeedBackId: string = '';
  commentFeedBackId: string = '';
}
