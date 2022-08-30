import { decorate, observable } from 'mobx';

export class CodeNameModel {
  code: string = '';
  name: string = '';

  constructor(codeName?: CodeNameModel) {
    if (codeName) {
      Object.assign(this, { ...codeName });
    }
  }
}


decorate(CodeNameModel, {
  code: observable,
  name: observable,
});
