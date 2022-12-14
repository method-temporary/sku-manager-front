import { decorate, observable } from 'mobx';

export class PermittedCineroom {
  //
  id: string = ''; // Card id
  cineroomId: string = '';
  required: boolean = false; // νμμ¬λΆ

  constructor(permittedCineroom?: PermittedCineroom) {
    //
    if (permittedCineroom) {
      Object.assign(this, { ...permittedCineroom });
    }
  }
}

decorate(PermittedCineroom, {
  id: observable,
  cineroomId: observable,
  required: observable,
});
