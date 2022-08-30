import { computed, decorate, observable } from 'mobx';
import { QueryModel } from 'shared/model';
import { GroupBasedAccessRule } from 'shared/model/GroupBasedAccessRule';

export class DataCardPermittedQueryModel extends QueryModel {
  name: string = '';

  groupBasedAccessRule: GroupBasedAccessRule = new GroupBasedAccessRule();

  groupSequences: number[] = [];
  ruleStrings: string = '';

  constructor(cardPermittedQueryModel?: DataCardPermittedQueryModel) {
    super();

    if (cardPermittedQueryModel) {
      Object.assign(this, {
        ...cardPermittedQueryModel,
      });
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

decorate(DataCardPermittedQueryModel, {
  name: observable,
});
