import { computed, decorate, observable } from 'mobx';
import { QueryModel, GroupBasedAccessRule } from 'shared/model';

export class DataMetaCubeQueryModel extends QueryModel {
  college: string = '';
  channel: string = '';
  searchPart: string = '';
  name: string = '';
  startDate: number = 0;
  endDate: number = 0;
  learningType: string = '';
  mainCategory: string = 'Y';

  groupBasedAccessRule: GroupBasedAccessRule = new GroupBasedAccessRule();

  groupSequences: number[] = [];
  ruleStrings: string = '';

  constructor(metaCubeQueryModel?: DataMetaCubeQueryModel) {
    super();

    if (metaCubeQueryModel) {
      Object.assign(this, {
        ...metaCubeQueryModel,
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

decorate(DataMetaCubeQueryModel, {
  college: observable,
  channel: observable,
  name: observable,
  startDate: observable,
  endDate: observable,
  learningType: observable,
  mainCategory: observable,
});
