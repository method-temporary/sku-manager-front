import { DenizenKey } from '@nara.platform/accent/src/snap/index';
import { PatronKey, PolyglotModel } from 'shared/model';

export class CardOperatorIdentity {
  //
  companyCode: string = '';
  companyName: PolyglotModel = new PolyglotModel();
  departmentCode: string = '';
  departmentName: PolyglotModel = new PolyglotModel();
  email: string = '';
  id: string = '';
  name: PolyglotModel = new PolyglotModel();
  patronKey: DenizenKey = new PatronKey();

  constructor(cardOperatorIdentity?: CardOperatorIdentity) {
    //
    if (cardOperatorIdentity) {
      //
      const name = (cardOperatorIdentity.name && new PolyglotModel(cardOperatorIdentity.name)) || this.name;
      const companyName =
        (cardOperatorIdentity.companyName && new PolyglotModel(cardOperatorIdentity.companyName)) || this.companyName;
      const departmentName =
        (cardOperatorIdentity.departmentName && new PolyglotModel(cardOperatorIdentity.departmentName)) ||
        this.departmentName;

      Object.assign(this, { ...cardOperatorIdentity, name, companyName, departmentName });
    }
  }
}
