import { DiscussionCubeCompletionCondition } from './DiscussionCubeCompletionCondition';
import { RelatedUrl } from './RelatedUrl';
import { CubeDiscussion } from './CubeDiscussion';

export interface CubeDiscussionSdo {
  automaticCompletion: boolean;
  completionCondition: DiscussionCubeCompletionCondition;
  privateComment: boolean;
  relatedUrlList: RelatedUrl[];
}

function fromCubeDiscussion(discussion: CubeDiscussion): CubeDiscussionSdo {
  return {
    ...discussion,
  };
}

export const CubeDiscussionSdoFunc = { fromCubeDiscussion };
