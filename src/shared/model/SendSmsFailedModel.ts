import { decorate, observable } from 'mobx';

export class SendSmsFailedModel {
  //
  rsltValMsg: string = '';
  count: number = 0;

  constructor(failedModel?: SendSmsFailedModel) {
    //
    if (failedModel) {
      Object.assign(this, { ...failedModel });
    }
  }
}

decorate(SendSmsFailedModel, {
  rsltValMsg: observable,
  count: observable,
});

export default SendSmsFailedModel;
