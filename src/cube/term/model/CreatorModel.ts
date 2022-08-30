import { decorate, observable } from 'mobx';

export class CreatorModel {
  //
  name: string = '';
  email: string = '';
  companyCode: string = '';

  constructor(creator?: CreatorModel) {
    if (creator) {
      Object.assign(this, { ...creator });
    }
  }
}

decorate(CreatorModel, {
  name: observable,
  email: observable,
  companyCode: observable,
});
