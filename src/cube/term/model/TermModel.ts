import { ConceptModel } from './ConceptModel';
import { decorate, observable } from 'mobx';

export class TermModel {
  //
  concept: ConceptModel = new ConceptModel();
  id: string = '';
  name: string = '';
  synonymTag: string = '';
  registrantName: string = '';
  registeredTime: number = 0;
  modifierName: string = '';
  modifiedTime: number = 0;

  constructor(term?: TermModel) {
    if (term) {
      Object.assign(this, { ...term });
    }
  }
}

decorate(TermModel, {
  concept: observable,
  id: observable,
  name: observable,
  synonymTag: observable,
  registrantName: observable,
  registeredTime: observable,
  modifierName: observable,
  modifiedTime: observable,
});
