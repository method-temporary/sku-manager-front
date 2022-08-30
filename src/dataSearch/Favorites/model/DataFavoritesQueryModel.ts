import { computed, decorate, observable } from 'mobx';
import { QueryModel, GroupBasedAccessRule } from 'shared/model';

export class DataFavoritesQueryModel extends QueryModel {
  //
  College: string = ''; // College
  Channel: string = ''; // Channel

  groupBasedAccessRule: GroupBasedAccessRule = new GroupBasedAccessRule();

  groupSequences: number[] = [];
  ruleStrings: string = '';

  constructor(QueryModel?: DataFavoritesQueryModel) {
    //
    super();

    if (QueryModel) {
      Object.assign(this, {
        ...QueryModel,
      });
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

decorate(DataFavoritesQueryModel, {
  College: observable,
  Channel: observable,
});
