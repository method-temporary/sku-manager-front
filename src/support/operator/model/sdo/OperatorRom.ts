import { PolyglotModel } from 'shared/model';
import { UserDetailModel } from 'user/model/UserDetailModel';

export default class OperatorRom {
  //
  denizenId: string = '';

  operatorGroupName: PolyglotModel = new PolyglotModel();
  operatorName: PolyglotModel = new PolyglotModel();
  company: PolyglotModel = new PolyglotModel();
  department: PolyglotModel = new PolyglotModel();
  email: string = '';

  constructor(operatorRom?: OperatorRom) {
    if (operatorRom) {
      const operatorGroupName = operatorRom && new PolyglotModel(operatorRom.operatorGroupName);
      const operatorName = operatorRom && new PolyglotModel(operatorRom.operatorName);
      const company = operatorRom && new PolyglotModel(operatorRom.company);
      const department = operatorRom && new PolyglotModel(operatorRom.department);
      Object.assign(this, { ...operatorRom, operatorGroupName, operatorName, company, department });
    }
  }

  static fromUserDetailModel(user: UserDetailModel) {
    return {
      denizenId: user && user.user.id,
      operatorGroupName: new PolyglotModel(),
      operatorName: user && user.user.name,
      company: user && user.user.companyName,
      department: user && user.user.departmentName,
      email: user && user.user.email,
    };
  }
}
