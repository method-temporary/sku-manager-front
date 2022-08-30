import { computed, decorate, observable } from 'mobx';
import { QueryModel } from 'shared/model';
import { GroupBasedAccessRule } from 'shared/model/GroupBasedAccessRule';

export class DataCardPrerequisiteQueryModel extends QueryModel {
  searchSearchable: string = 'SearchOn'; // 공개 / 비공개

  groupBasedAccessRule: GroupBasedAccessRule = new GroupBasedAccessRule();

  groupSequences: number[] = [];
  ruleStrings: string = '';

  constructor(cardPrerequisiteQueryModel?: DataCardPrerequisiteQueryModel) {
    super();

    if (cardPrerequisiteQueryModel) {
      Object.assign(this, {
        ...cardPrerequisiteQueryModel,
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

decorate(DataCardPrerequisiteQueryModel, {
  searchSearchable:observable,
});
