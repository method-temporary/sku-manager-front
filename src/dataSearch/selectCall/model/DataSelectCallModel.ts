import {computed, decorate, observable} from 'mobx';

export class DataSelectCallModel {
  //
  select_id       : string = '';
  select_name     : string = '';

  groupSequences: number[] = [];

  constructor(model?: DataSelectCallModel) {
    //
    if (model) {
      Object.assign(this, {...model});
    }
  }

  @computed
  get sequences() {
    //
    let sequences = '';
    this.groupSequences.map((seq, index) => {
      index === 0 ? (sequences = seq + '') : (sequences += ',' + seq);
    });

    return sequences;
  }
}

decorate(DataSelectCallModel, {
  select_id     : observable,
  select_name   : observable,
});
