import { computed, decorate, observable } from 'mobx';
import moment from 'moment';

import { DenizenKey } from '@nara.platform/accent';

import { PatronKey, PolyglotModel, DramaEntityObservableModel } from 'shared/model';

import { UserCubeState } from './vo/UserCubeState';
import { OpenRequest } from './vo/OpenRequest';

export class UserCubeModel extends DramaEntityObservableModel {
  //
  state: UserCubeState = UserCubeState.OpenApproval;
  openRequests: OpenRequest[] = [];

  creator: DenizenKey = new PatronKey();
  openedTime: number = 0;

  approverName: PolyglotModel = new PolyglotModel();

  constructor(userCube?: UserCubeModel) {
    super();
    if (userCube) {
      const openRequests = userCube.openRequests && userCube.openRequests.map((target) => new OpenRequest(target));
      const approverName = new PolyglotModel(userCube.approverName);
      Object.assign(this, { ...userCube, openRequests, approverName });
    }
  }

  @computed
  get getApprovalDate() {
    const finalApprovalTime =
      this.openRequests && this.openRequests.length && this.openRequests[this.openRequests.length - 1].time;
    return (
      (finalApprovalTime && finalApprovalTime !== 0 && moment(finalApprovalTime).format('YYYY.MM.DD HH:mm:ss')) || '-'
    );
  }
}

decorate(UserCubeModel, {
  state: observable,
  openRequests: observable,

  openedTime: observable,
  creator: observable,

  approverName: observable,
});
