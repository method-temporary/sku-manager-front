import { decorate, observable } from 'mobx';

export class PermittedCinerooms {
  //
  cineroomId: string = '';
  id: string = '';
  required: boolean = true;
}

decorate(PermittedCinerooms, {
  cineroomId: observable,
  id: observable,
  required: observable,
});
