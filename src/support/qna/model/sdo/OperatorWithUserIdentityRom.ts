import { decorate, observable } from 'mobx';
import { PolyglotModel } from 'shared/model';

import { UserIdentityModel } from 'cube/user/model/UserIdentityModel';
import OperatorWithUserIdentity from 'support/operator/model/sdo/OperatorWithUserIdentity';

export class OperatorWithUserIdentityRom {
  //
  denizenId: string = '';
  operatorName: PolyglotModel = new PolyglotModel();
  operatorGroupName: PolyglotModel = new PolyglotModel();
  company: PolyglotModel = new PolyglotModel();
  department: PolyglotModel = new PolyglotModel();
  email: string = '';
  cardOperator: boolean = false;

  // titles: LanguageStrings = new LanguageStrings();
  // ranks: LanguageStrings = new LanguageStrings();
  // duties: LanguageStrings = new LanguageStrings();
  //
  // chartDisplayed: boolean = false;
  // displayOrder: string = '';
  // retired: boolean = false;

  constructor(userIdentity?: OperatorWithUserIdentityRom) {
    if (userIdentity) {
      const operatorName = new PolyglotModel(userIdentity.operatorName);
      const operatorGroupName = new PolyglotModel(userIdentity.operatorGroupName);
      const company = new PolyglotModel(userIdentity.company);
      const department = new PolyglotModel(userIdentity.department);
      Object.assign(this, {
        ...userIdentity,
        operatorName,
        operatorGroupName,
        company,
        department,
      });
    }
  }

  static fromOperatorWithUserIdentity(
    user: OperatorWithUserIdentity,
    operatorGroupName?: PolyglotModel
  ): OperatorWithUserIdentityRom {
    if (user && user.operator && user.userIdentity) {
      const { operator, userIdentity } = user;
      return {
        denizenId: userIdentity.id,
        operatorName: new PolyglotModel(userIdentity.name),
        operatorGroupName: (operatorGroupName && new PolyglotModel(operatorGroupName)) || new PolyglotModel(),
        company: new PolyglotModel(userIdentity.companyName),
        department: new PolyglotModel(userIdentity.departmentName),
        email: userIdentity.email,
        cardOperator: false,
      };
    } else {
      return new OperatorWithUserIdentityRom();
    }
  }

  static fromUserIdentityModel(
    user: UserIdentityModel,
    operatorGroupName?: PolyglotModel
  ): OperatorWithUserIdentityRom {
    if (user) {
      return {
        denizenId: user.id,
        operatorName: new PolyglotModel(user.name),
        operatorGroupName: (operatorGroupName && new PolyglotModel(operatorGroupName)) || new PolyglotModel(),
        company: new PolyglotModel(user.companyName),
        department: new PolyglotModel(user.departmentName),
        email: user.email,
        cardOperator: false,
      };
    } else {
      return new OperatorWithUserIdentityRom();
    }
  }
}

decorate(OperatorWithUserIdentityRom, {
  denizenId: observable,
  operatorName: observable,
  operatorGroupName: observable,
  company: observable,
  department: observable,
  email: observable,
  cardOperator: observable,
});
