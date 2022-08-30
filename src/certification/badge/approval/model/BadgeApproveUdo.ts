import { decorate, observable } from 'mobx';
import { OpenRequestModel } from '_data/badge/badges/model/vo';

export default class BadgeApproveUdo {
  badgeIds: string[] = [];
  ids: string[] = [];
  remark?: string = '';
  openRequest: OpenRequestModel = new OpenRequestModel();

  constructor(badgeApprove?: BadgeApproveUdo) {
    if (badgeApprove) {
      const openRequest = (this.openRequest && new OpenRequestModel(badgeApprove.openRequest)) || this.openRequest;
      Object.assign(this, { ...badgeApprove, openRequest });
    }
  }
}
decorate(BadgeApproveUdo, {
  badgeIds: observable,
  ids: observable,
  remark: observable,
  openRequest: observable,
});
