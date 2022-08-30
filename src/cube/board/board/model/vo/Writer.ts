import { decorate, observable } from 'mobx';
import { PolyglotModel } from 'shared/model';

export class Writer {
  //
  employeeId: string = '';
  email: string = '';
  name: PolyglotModel = new PolyglotModel();

  constructor(writer?: Writer) {
    if (writer) {
      const name = new PolyglotModel(writer.name);
      Object.assign(this, { ...writer });
    }
  }
}

decorate(Writer, {
  employeeId: observable,
  email: observable,
  name: observable,
});
