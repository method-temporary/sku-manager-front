import { PatronKey } from '@nara.platform/accent';

import { IdName } from 'shared/model';

import MenuDiscussionFeedBack, { getEmptyMenuDiscussionFeedBack } from './MenuDiscussionFeedBack';

export class MenuDiscussionRdo {
  id: string = '';
  title: string = '';
  audienceKey: string = '';
  sourceEntity: IdName = new IdName();
  config: MenuDiscussionFeedBack = getEmptyMenuDiscussionFeedBack();
  patronKey: PatronKey = {} as PatronKey;
  time: number = 0;

  constructor(menuDiscussionRdo?: MenuDiscussionRdo) {
    //
    if (menuDiscussionRdo) {
      Object.assign(this, { ...menuDiscussionRdo });
    }
  }
}

export default MenuDiscussionRdo;
