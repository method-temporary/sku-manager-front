import { DramaEntityObservableModel } from 'shared/model';
import { decorate, observable } from 'mobx';
import OperatorCdo from './sdo/OperatorCdo';

export default class OperatorModel extends DramaEntityObservableModel {
  //
  operatorGroupId: string = '';
  denizenId: string = '';

  registrant: string = '';
  registeredTime: number = 0;
  modifier: string = '';
  modifiedTime: number = 0;

  name: string = '';
  companyName: string = '';
  departmentName: string = '';
  email: string = '';

  constructor(operator?: OperatorModel) {
    super();
    if (operator) {
      Object.assign(this, { ...operator });
    }
  }

  static asCdo(operator: OperatorModel): OperatorCdo {
    //
    return {
      operatorGroupId: operator.operatorGroupId,
      denizenId: operator.denizenId,
    };
  }
}

decorate(OperatorModel, {
  operatorGroupId: observable,
  denizenId: observable,

  name: observable,
  companyName: observable,
  departmentName: observable,
  email: observable,
});
