import { computed, decorate, observable } from 'mobx';

export class DataCardPrerequisiteModel {
  cardId : string = '';
  cardName : string = '';
  prerequisiteCardId : string = '';
  prerequisiteCardName : string = '';
  searchable : string = '';

  groupSequences: number[] = [];

  constructor(model?: DataCardPrerequisiteModel) {
    if (model) {
      Object.assign(this, { ...model });
    }
  }

  @computed
  get sequences() {
    let sequences = '';
    this.groupSequences.map((seq, index) => {
      index === 0 ? (sequences = seq + '') : (sequences += ',' + seq);
    });

    return sequences;
  }
}

decorate(DataCardPrerequisiteModel, {
  cardId : observable,
  cardName : observable,
  prerequisiteCardId : observable,
  prerequisiteCardName : observable,
  searchable : observable,
});

export default DataCardPrerequisiteModel;
