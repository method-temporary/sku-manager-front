import { decorate, observable } from 'mobx';

export class FreeOfCharge {
  freeOfCharge: boolean = true;
  chargeAmount: number = 0;
  approvalProcess: boolean = false;
  sendmailFlag: boolean = false;

  constructor(freeOfCharge?: FreeOfCharge) {
    //
    Object.assign(this, { ...freeOfCharge });
  }
}

decorate(FreeOfCharge, {
  freeOfCharge: observable,
  chargeAmount: observable,
  approvalProcess: observable,
  sendmailFlag: observable,
});
