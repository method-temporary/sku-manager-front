import { decorate, observable } from 'mobx';

import { PolyglotModel } from 'shared/model';

export class IdPolyglot {
  //
  id: string = '';
  name: PolyglotModel = new PolyglotModel();

  constructor(idName?: IdPolyglot) {
    if (idName) {
      Object.assign(this, idName);
    }
  }
}

decorate(IdPolyglot, {
  id: observable,
  name: observable,
});
