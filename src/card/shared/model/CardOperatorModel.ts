import { decorate, observable } from 'mobx';
import { PolyglotModel } from 'shared/model';

export class CardOperatorModel {
  //
  id: string = '';
  email: string = '';
  name: PolyglotModel = new PolyglotModel();
  companyCode: string = '';
  companyName: PolyglotModel = new PolyglotModel();

  constructor(cardOperator?: CardOperatorModel) {
    //
    if (cardOperator) {
      Object.assign(this, cardOperator);
    }
  }

  setOperator(id: string, name: PolyglotModel, email: string, companyCode: string, companyName: PolyglotModel) {
    //
    Object.assign(this, {
      id,
      email,
      name,
      companyCode,
      companyName,
    });
  }
}

decorate(CardOperatorModel, {
  id: observable,
  email: observable,
  name: observable,
  companyCode: observable,
  companyName: observable,
});
