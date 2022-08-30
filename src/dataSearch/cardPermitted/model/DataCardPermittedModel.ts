import { computed, decorate, observable } from 'mobx';

export class DataCardPermittedModel {
  cardId : string = '';
  cardName : string = '';
  companyName : string = '';

  groupSequences: number[] = [];

  constructor(model?: DataCardPermittedModel) {
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

decorate(DataCardPermittedModel, {
  cardId : observable,
  cardName : observable,
  companyName : observable,
});

export default DataCardPermittedModel;
