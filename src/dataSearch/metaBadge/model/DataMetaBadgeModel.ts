import { decorate, observable } from 'mobx';

export class DataMetaBadgeModel {
  badgeId: string = '';
  badgeName: string = '';
  order: number = 0;
  level: string = '';
  createdTime: string = '';
  cardId: string = '';
  cardName: string = '';
  collegeName: string = '';
  collegeId: string = '';
  channelId: string = '';
  channelName: string = '';
  twoDepthChannelId: string = '';
  twoDepthChannelName: string = '';

  constructor(model?: DataMetaBadgeModel) {
    if (model) {
      Object.assign(this, { ...model });
    }
  }
}

decorate(DataMetaBadgeModel, {
  badgeId: observable,
  badgeName: observable,
  order: observable,
  level: observable,
  createdTime: observable,
  cardId: observable,
  cardName: observable,
  collegeName: observable,
  collegeId: observable,
  channelId: observable,
  channelName: observable,
  twoDepthChannelId: observable,
  twoDepthChannelName: observable,
});

export default DataMetaBadgeModel;
