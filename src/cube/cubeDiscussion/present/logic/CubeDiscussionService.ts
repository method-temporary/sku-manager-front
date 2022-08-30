import { action, observable } from 'mobx';
import autobind from 'autobind-decorator';
import _ from 'lodash';
import { CubeDiscussionModel } from '../../model/CubeDiscussionModel';

@autobind
export default class CubeDiscussionService {
  //
  static instance: CubeDiscussionService;

  @observable
  cubeDiscussion: CubeDiscussionModel = new CubeDiscussionModel();

  @observable
  cubeDiscussions: CubeDiscussionModel[] = [];

  @action
  setMedia(cubeDiscussion: CubeDiscussionModel): void {
    this.cubeDiscussion = cubeDiscussion;
  }

  @action
  changeCubeDiscussionProps(name: string, value: any) {
    //
    // this.cubeDiscussion = _.set(this.cubeDiscussion, name, value);
    this.cubeDiscussion = _.set(this.cubeDiscussion, name, value);
    // if (typeof value === 'object' && nameSub) {
    //   this.cubeDiscussion = _.set(this.cubeDiscussion, nameSub, valueSub);
    // }
  }

  @action
  clearCubeDiscussion() {
    //
    this.cubeDiscussion = new CubeDiscussionModel();
  }
}

Object.defineProperty(CubeDiscussionService, 'instance', {
  value: new CubeDiscussionService(),
  writable: false,
  configurable: false,
});
