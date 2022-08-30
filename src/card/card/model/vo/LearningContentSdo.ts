import { LearningContentType } from './LearningContentType';
import { decorate, observable } from 'mobx';
import { PolyglotModel } from 'shared/model';

export class LearningContentSdo {
  //
  contentId: string = '';
  name: PolyglotModel = new PolyglotModel();
  learningContentType: LearningContentType = LearningContentType.Cube;
  children: LearningContentSdo[] = [];

  constructor(learningContentSdo?: LearningContentSdo) {
    //
    if (learningContentSdo) {
      Object.assign(this, { ...learningContentSdo });
    }
  }
}

decorate(LearningContentSdo, {
  contentId: observable,
  name: observable,
  learningContentType: observable,
  children: observable,
});
