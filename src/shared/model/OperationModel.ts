import { computed, decorate, observable } from 'mobx';
import { IdName } from './IdName';
import { OperatorModel } from '../../community/community/model/OperatorModel';

export class OperationModel {
  operator: OperatorModel = new OperatorModel();
  location: string = '';
  phoneNumber: string = '';
  organizer: IdName = new IdName();
  etcCp: string = '';
  siteUrl: string = '';

  constructor(operation?: OperationModel) {
    if (operation) {
      const operator = (operation.operator && new OperatorModel(operation.operator)) || this.operator;
      const organizer = (operation.organizer && new IdName(operation.organizer)) || this.organizer;
      Object.assign(this, { ...operation, operator, organizer });
    }
  }

  @computed
  get getOperatorEmployeeId() {
    return this.operator && this.operator.employeeId;
  }

  @computed
  get getOperatorCompany() {
    return (this.operator && this.operator.company) || '-';
  }

  @computed
  get getOperatorName() {
    return (this.operator && this.operator.name) || '-';
  }

  @computed
  get getOperatorEmail() {
    return (this.operator && this.operator.email) || '-';
  }
}

decorate(OperationModel, {
  operator: observable,
  location: observable,
  phoneNumber: observable,
  organizer: observable,
  etcCp: observable,
  siteUrl: observable,
});
