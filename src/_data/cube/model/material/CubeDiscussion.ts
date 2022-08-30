import { DramaEntity } from '@nara.platform/accent';
import {
  DiscussionCubeCompletionCondition,
  getInitDiscussionCubeCompletionCondition,
} from './DiscussionCubeCompletionCondition';
import { RelatedUrl } from './RelatedUrl';
import { PatronKey, PolyglotModel } from '../../../../shared/model';

export interface CubeDiscussion extends DramaEntity {
  automaticCompletion: boolean;
  completionCondition: DiscussionCubeCompletionCondition;
  privateComment: boolean;
  relatedUrlList: RelatedUrl[];
}

export function getInitCubeDiscussion(): CubeDiscussion {
  //
  return {
    automaticCompletion: false,
    completionCondition: getInitDiscussionCubeCompletionCondition(),
    privateComment: false,
    relatedUrlList: [],
    id: '',
    patronKey: new PatronKey(),
    entityVersion: 0,
  };
}
