import { UserIdentityModel } from '../../../../cube/user/model/UserIdentityModel';
import OperatorModel from '../OperatorModel';

export default class OperatorWithUserIdentity {
  //
  operator: OperatorModel = new OperatorModel();
  userIdentity: UserIdentityModel = new UserIdentityModel();

  constructor(operatorWithUserIdentity: OperatorWithUserIdentity) {
    if (operatorWithUserIdentity) {
      const operator = new OperatorModel(operatorWithUserIdentity.operator);
      const userIdentity = new UserIdentityModel(operatorWithUserIdentity.userIdentity);
      Object.assign(this, { ...operatorWithUserIdentity, operator, userIdentity });
    }
  }
}
