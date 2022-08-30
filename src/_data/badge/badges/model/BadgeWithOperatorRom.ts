import { BadgeModel } from './BadgeModel';
import { UserIdentityModel } from '../../../../cube/user/model/UserIdentityModel';
import { decorate, observable } from 'mobx';

export default class BadgeWithOperatorRom {
  badge: BadgeModel = new BadgeModel();
  badgeOperatorIdentity: UserIdentityModel = new UserIdentityModel();

  constructor(badgeWithOperator?: BadgeWithOperatorRom) {
    if (badgeWithOperator) {
      Object.assign(this, { ...badgeWithOperator });
    }
  }
}

decorate(BadgeWithOperatorRom, {
  badge: observable,
  badgeOperatorIdentity: observable,
});
