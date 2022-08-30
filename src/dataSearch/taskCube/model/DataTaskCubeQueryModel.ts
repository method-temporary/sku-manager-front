import { computed, decorate, observable } from 'mobx';
import { QueryModel, GroupBasedAccessRule } from 'shared/model';

export class DataTaskCubeQueryModel extends QueryModel {
  college: string = '';
  channel: string = '';
  searchPart: string = '';
  id: string = '';
  name: string = '';
  startDate: number = 0;
  endDate: number = 0;
  learningType: string = '';

  groupBasedAccessRule: GroupBasedAccessRule = new GroupBasedAccessRule();

  groupSequences: number[] = [];
  ruleStrings: string = '';

  constructor(taskCubeQueryModel?: DataTaskCubeQueryModel) {
    super();

    if (taskCubeQueryModel) {
      Object.assign(this, {
        ...taskCubeQueryModel,
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

decorate(DataTaskCubeQueryModel, {
  college: observable,
  channel: observable,
  id: observable,
  name: observable,
  startDate: observable,
  endDate: observable,
  learningType: observable,
});
