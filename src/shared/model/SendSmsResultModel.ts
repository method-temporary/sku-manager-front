import { decorate, observable } from 'mobx';

export class SendSmsResultModel {
  //
  eventId: string = '';
  from: string = '';
  id: string = '';
  message: string = '';
  time: number = 0;
  to: string[] = [];

  constructor(smsResult?: SendSmsResultModel) {
    //
    if (smsResult) {
      Object.assign(this, { ...smsResult });
      this.to = (smsResult.to && [...smsResult.to]) || [];
    }
  }
}

decorate(SendSmsResultModel, {
  eventId: observable,
  from: observable,
  id: observable,
  message: observable,
  time: observable,
  to: observable,
});

export default SendSmsResultModel;
