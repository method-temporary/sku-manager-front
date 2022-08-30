import { decorate, observable } from 'mobx';
import { LangStrings } from 'shared/model';

export class FormDesignerModel {
  email: string = '';
  usid: string = ''; // 사번, 회원번호, 등
  names: LangStrings = new LangStrings();
  companies: LangStrings = new LangStrings();

  constructor(formDesigner?: FormDesignerModel) {
    //
    if (formDesigner) {
      const names = (formDesigner.names && new LangStrings(formDesigner.names)) || this.names;
      const companies = (formDesigner.companies && new LangStrings(formDesigner.companies)) || this.names;
      Object.assign(this, { ...formDesigner, names, companies });
    }
  }
}

decorate(FormDesignerModel, {
  email: observable,
  usid: observable,
  names: observable,
  companies: observable,
});
