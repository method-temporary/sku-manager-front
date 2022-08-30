import { computed, decorate, observable } from 'mobx';
import { QueryModel } from 'shared/model';

export class DataMetaBadgeQueryModel {
  searchPart: string = '';
  searchWord: string = '';

  offset: number = 0;
  limit: number = 20;

  groupSequences: number[] = [];

  constructor(queryModel?: DataMetaBadgeQueryModel) {
    if (queryModel) {
      Object.assign(this, { ...queryModel });
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

decorate(DataMetaBadgeQueryModel, {
  searchPart: observable,
  searchWord: observable,

  offset: observable,
  limit: observable,
});
