import { DataCardPermittedModel } from './DataCardPermittedModel';

class DataCardPermittedExcelModel {
  'CardID' : string = '';
  'Card명' : string = '';
  '핵인싸 범위' : string = '';

  constructor(model?: DataCardPermittedModel) {
    if (model) {
      Object.assign(this, {
        'CardID' : model.cardId,
        'Card명' : model.cardName,
        '핵인싸 범위' : model.companyName,
      });
    }
  }
}

export default DataCardPermittedExcelModel;
