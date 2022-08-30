import { IdName } from 'shared/model';

export class FeedbackCdo {
  title: string = '';
  audienceKey: string = '';
  sourceEntity: IdName = new IdName();

  constructor(feedBackCdo?: FeedbackCdo) {
    //
    if (feedBackCdo) {
      Object.assign(this, { ...feedBackCdo });
    }
  }
}

export default FeedbackCdo;
