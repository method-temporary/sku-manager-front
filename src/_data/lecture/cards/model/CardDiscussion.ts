import { PolyglotModel } from '../../../../shared/model';
import { RelatedUrl } from '../../../cube/model/material';

export interface CardDiscussion {
  //
  commentFeedbackId: string;
  content: PolyglotModel;
  depotId: string;
  id: string;
  privateComment: boolean;
  relatedUrlList: RelatedUrl[];
  title: PolyglotModel;
}

function initialize() {
  return {
    commentFeedbackId: '',
    content: new PolyglotModel(),
    depotId: '',
    id: '',
    privateComment: false,
    relatedUrlList: [
      {
        title: '',
        url: '',
      },
    ],
    title: new PolyglotModel(),
  };
}

export const CardDiscussionFunc = { initialize };
