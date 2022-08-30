import { decorate, observable } from 'mobx';
import { DenizenKey } from '@nara.platform/accent';
import { PatronKey } from 'shared/model';
import { OperatorModel } from '../../../../community/community/model/OperatorModel';

export class Operation {
  //
  operator: DenizenKey = new PatronKey();
  location: string = '';
  siteUrl: string = '';

  operatorInfo: OperatorModel = new OperatorModel();

  constructor(operation?: Operation) {
    if (operation) {
      //
      const operator = new PatronKey(operation.operator);
      Object.assign(this, { ...operation, operator });
    }
  }
}

decorate(Operation, {
  operator: observable,
  location: observable,
  siteUrl: observable,

  operatorInfo: observable,
});
