import { decorate, observable } from 'mobx';

export class BadgeOperatorModel {
  //
  id: string = '';
  name: string = '';
  companyCode: string = '';
  companyName: string = '';

  constructor(badgeOperator?: BadgeOperatorModel) {
    //
    if (badgeOperator) {
      Object.assign(this, badgeOperator);
    }
  }
}

decorate(BadgeOperatorModel, {
  id: observable,
  name: observable,
  companyCode: observable,
  companyName: observable,
});
