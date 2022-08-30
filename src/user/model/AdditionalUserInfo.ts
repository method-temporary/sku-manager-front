import { decorate, observable } from 'mobx';

import { IdNameList } from 'shared/model';

export class AdditionalUserInfo {
  //
  currentJobGroupId: string = '';
  currentJobDutyId: string = '';
  favoriteJobGroupId: string = '';
  favoriteJobDutyId: string = '';
  favoriteChannelIds: string[] = [];
  favoriteLearningTypes: IdNameList = new IdNameList();
  // learingGoal: LearningGoal

  constructor(additionalUserInfo?: AdditionalUserInfo) {
    if (additionalUserInfo) {
      Object.assign(this, { ...additionalUserInfo });
    }
  }
}

decorate(AdditionalUserInfo, {
  currentJobGroupId: observable,
  currentJobDutyId: observable,
  favoriteJobGroupId: observable,
  favoriteJobDutyId: observable,
  favoriteChannelIds: observable,
  favoriteLearningTypes: observable,
});
