import { decorate, observable } from 'mobx';

export class BadgeApproverModel {
  //
  id: string = '';
  citizenId: string = '';
  cineroomId: string = '';
  displayName: string = '';
  usId: string = '';
  state: number = 0;
  type: string = '';
  loginId: string = '';

  checked: boolean = false;

  constructor(badgeApproverModel?: BadgeApproverModel) {
    if (badgeApproverModel) {
      Object.assign(this, {
        ...badgeApproverModel,
      });
    }
  }
}

decorate(BadgeApproverModel, {
  id: observable,
  citizenId: observable,
  displayName: observable,
  usId: observable,
  state: observable,
  type: observable,
  cineroomId: observable,
  loginId: observable,
  checked: observable,
});
