import { decorate, observable } from 'mobx';
import { DiscussionCubeCompletionCondition } from '../vo/DiscussionCubeCompletionCondition';
import { RelatedUrl } from '../vo/RelatedUrl';

export class CubeDiscussionSdo {
  //
  // description: string = '';
  automaticCompletion: boolean = false;
  completionCondition: DiscussionCubeCompletionCondition = new DiscussionCubeCompletionCondition();

  // content: string = '';
  // depotId: string = '';
  relatedUrlList: RelatedUrl[] = [new RelatedUrl()];
  privateComment: boolean = false;
  anonymous: boolean = false;

  constructor(cubeDiscussionSdo?: CubeDiscussionSdo) {
    if (cubeDiscussionSdo) {
      const completionCondition = new DiscussionCubeCompletionCondition(cubeDiscussionSdo.completionCondition);
      Object.assign(this, { ...cubeDiscussionSdo, completionCondition });
    }
  }
}

decorate(CubeDiscussionSdo, {
  // description: observable,
  automaticCompletion: observable,
  completionCondition: observable,
  privateComment: observable,
  anonymous: observable,
});
