import { DramaEntity } from '@nara.platform/accent';
import { decorate, observable } from 'mobx';
import { PatronKey, LangStrings, PolyglotModel } from 'shared/model';

export class CompanyModel implements DramaEntity {
  id: string = '';
  entityVersion: number = 0;
  patronKey: PatronKey = new PatronKey();

  code: string = '';
  names: LangStrings = new LangStrings();
  parentCode: string = '';
  chartDisplayed: boolean = false;
  sortOrder: string = '';
  //charts: string = '';
  name: PolyglotModel = new PolyglotModel();

  constructor(companiesAvailable?: CompanyModel) {
    //
    if (companiesAvailable) {
      const names = (companiesAvailable.names && new LangStrings(companiesAvailable.names)) || this.names;
      const name = (companiesAvailable.name && new PolyglotModel(companiesAvailable.name)) || this.name;
      Object.assign(this, { ...companiesAvailable, names, name });
    }
  }
}

decorate(CompanyModel, {
  id: observable,
  entityVersion: observable,
  patronKey: observable,
  code: observable,
  names: observable,
  parentCode: observable,
  chartDisplayed: observable,
  sortOrder: observable,
  //charts: observable,
  name: observable,
});
