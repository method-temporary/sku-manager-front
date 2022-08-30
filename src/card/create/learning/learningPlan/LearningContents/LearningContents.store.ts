import { action, observable } from 'mobx';
import { LearningContentWithOptional } from '../../LearningContents/model/learningContentWithOptional';

class LearningContentsStore {
  //
  static instance: LearningContentsStore;

  @observable
  learningContents: LearningContentWithOptional[] = [];

  @action.bound
  setLearningContents(learningContents: LearningContentWithOptional[]) {
    //
    this.learningContents = learningContents;
  }

  @action.bound
  reset() {
    //
    this.learningContents = [];
  }
}

LearningContentsStore.instance = new LearningContentsStore();
export default LearningContentsStore;
