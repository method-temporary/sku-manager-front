import { decorate, observable } from 'mobx';

export class SendSmsSenderQualifiedModel {
  //
  id: string = '';
  qualified: boolean = false;

  constructor(emails?: SendSmsSenderQualifiedModel) {
    //
    if (emails) {
      Object.assign(this, { ...emails });
    }
  }
}

decorate(SendSmsSenderQualifiedModel, {
  id: observable,
  qualified: observable,
});

export default SendSmsSenderQualifiedModel;
