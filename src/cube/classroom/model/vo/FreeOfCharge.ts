import { decorate, observable } from 'mobx';

export class FreeOfCharge {
  //
  freeOfCharge: boolean = true;
  chargeAmount: number = 0;
  approvalProcess: boolean = false;
  // Master 추가 항목
  sendingMail: boolean = false;

  constructor(freeOfCharge?: FreeOfCharge) {
    //
    if (freeOfCharge) {
      Object.assign(this, { ...freeOfCharge });
    }
  }
}

decorate(FreeOfCharge, {
  freeOfCharge: observable,
  chargeAmount: observable,
  approvalProcess: observable,
  sendingMail: observable,
});
