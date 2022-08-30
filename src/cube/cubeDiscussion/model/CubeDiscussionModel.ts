import { DramaEntityObservableModel } from 'shared/model';
import { DiscussionCubeCompletionCondition } from './vo/DiscussionCubeCompletionCondition';
import { RelatedUrl } from './vo/RelatedUrl';
import { decorate, observable } from 'mobx';
import { CubeDiscussionSdo } from './sdo/CubeDiscussionSdo';

export class CubeDiscussionModel extends DramaEntityObservableModel {
  //
  // description: string = '';
  automaticCompletion: boolean = false;
  completionCondition: DiscussionCubeCompletionCondition = new DiscussionCubeCompletionCondition();

  // content: string = '';
  // depotId: string = '';
  relatedUrlList: RelatedUrl[] = [new RelatedUrl()];
  privateComment: boolean = false;
  anonymous: boolean = false;

  constructor(cubeDiscussion?: CubeDiscussionModel) {
    super();
    if (cubeDiscussion) {
      const cubeCompletion = new DiscussionCubeCompletionCondition(cubeDiscussion.completionCondition);
      Object.assign(this, { ...cubeDiscussion, cubeCompletion });
    }
  }

  static asSdo(cubeDiscussion: CubeDiscussionModel): CubeDiscussionSdo {
    //
    return {
      // description: cubeDiscussion.description,
      automaticCompletion: cubeDiscussion.automaticCompletion,
      completionCondition: cubeDiscussion.completionCondition,

      // content: cubeDiscussion.content,
      // depotId: cubeDiscussion.depotId,
      relatedUrlList: cubeDiscussion.relatedUrlList,
      privateComment: cubeDiscussion.privateComment,
      anonymous: cubeDiscussion.anonymous,
    };
  }
}

decorate(CubeDiscussionModel, {
  // description: observable,
  automaticCompletion: observable,
  completionCondition: observable,

  // content: observable,
  // depotId: observable,
  relatedUrlList: observable,
  privateComment: observable,
  anonymous: observable,
});
