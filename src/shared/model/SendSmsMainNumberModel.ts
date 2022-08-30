import { decorate, observable } from 'mobx';

export class SendSmsMainNumberModel {
  //
  phone: string = '';
  name: string = '';

  constructor(emails?: SendSmsMainNumberModel) {
    //
    if (emails) {
      Object.assign(this, { ...emails });
    }
  }
}

decorate(SendSmsMainNumberModel, {
  phone: observable,
  name: observable,
});

export default SendSmsMainNumberModel;
