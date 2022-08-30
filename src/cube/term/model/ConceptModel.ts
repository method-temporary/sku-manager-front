import { TermModel } from './TermModel';
import { decorate, observable } from 'mobx';

export class ConceptModel {
  //
  id: string = '';
  name: string = '';
  displaySort: number = 0;

  terms: TermModel[] = [];

  constructor(concept?: ConceptModel) {
    if (concept) {
      Object.assign(this, { ...concept });
    }
  }
}

decorate(ConceptModel, {
  id: observable,
  name: observable,
  displaySort: observable,

  terms: observable,
});
