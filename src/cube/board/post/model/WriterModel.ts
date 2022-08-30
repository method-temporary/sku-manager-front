import { decorate, observable } from 'mobx';

import { PolyglotModel } from 'shared/model';

export class WriterModel {
  employeeId: string = '';
  email: string = '';
  name: PolyglotModel = new PolyglotModel();
  companyCode: string = '';
  companyName: PolyglotModel = new PolyglotModel();

  constructor(writer?: WriterModel) {
    //
    if (writer) {
      const name = (writer.name && new PolyglotModel(writer.name)) || this.name;
      const companyName = (writer.companyName && new PolyglotModel(writer.companyName)) || this.companyName;
      Object.assign(this, { ...writer, name, companyName });
    }
  }
}

decorate(WriterModel, {
  employeeId: observable,
  email: observable,
  name: observable,
  companyCode: observable,
  companyName: observable,
});
