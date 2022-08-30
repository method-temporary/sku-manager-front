import { DataCardPrerequisiteModel } from './DataCardPrerequisiteModel';

class DataCardPrerequisiteExcelModel {
  'CardID' : string = '';
  'Card명' : string = '';
  '선수 과정 Card ID' : string = '';
  '선수 과정 Card명' : string = '';
  '카드 공개여부' : string = '';

  constructor(model?: DataCardPrerequisiteModel) {
    if (model) {
      Object.assign(this, {
        'CardID' : model.cardId,
        'Card명' : model.cardName,
        '선수 과정 Card ID' : model.prerequisiteCardId,
        '선수 과정 Card명' : model.prerequisiteCardName,
        '카드 공개여부' : model.searchable,
      });
    }
  }
}

export default DataCardPrerequisiteExcelModel;
