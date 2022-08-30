import { decorate, observable } from 'mobx';
import { PolyglotModel } from './PolyglotModel';

export class CreatorModel {
  name: PolyglotModel = new PolyglotModel();
  email: string = '';
  company: string = '';
  createType: string = '';
  department: string = '';
  companyCode: string = '';

  constructor(creator?: CreatorModel) {
    if (creator) {
      const name = (creator.name && new PolyglotModel(creator.name)) || this.name;

      Object.assign(this, { ...creator, name });
    }
  }
}

decorate(CreatorModel, {
  name: observable,
  email: observable,
  company: observable,
  createType: observable,
  department: observable,
  companyCode: observable,
});
