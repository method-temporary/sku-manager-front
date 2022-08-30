import { computed, decorate, observable } from 'mobx';
import { QueryModel, GroupBasedAccessRule } from 'shared/model';

export class DataLearningCubeQueryModel extends QueryModel {
  college: string = '';
  channel: string = '';
  companyCode: string = '';
  searchPart: string = '과정명';
  name: string = '';
  startDate: number = 0;
  endDate: number = 0;

  groupBasedAccessRule: GroupBasedAccessRule = new GroupBasedAccessRule();

  groupSequences: number[] = [];
  ruleStrings: string = '';

  constructor(learningCubeQueryModel?: DataLearningCubeQueryModel) {
    super();

    if (learningCubeQueryModel) {
      Object.assign(this, {
        ...learningCubeQueryModel,
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

decorate(DataLearningCubeQueryModel, {
  college: observable,
  channel: observable,
  companyCode: observable,
  name: observable,
  startDate: observable,
  endDate: observable,
});
