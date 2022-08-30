import { computed, decorate, observable } from 'mobx';
import { QueryModel, GroupBasedAccessRule } from 'shared/model';

export class DataCubeClassroomQueryModel extends QueryModel {
  college: string = '';
  channel: string = '';
  searchPart: string = '';
  name: string = '';
  startDate: number = 0;
  endDate: number = 0;
  learningType: string = '';

  groupBasedAccessRule: GroupBasedAccessRule = new GroupBasedAccessRule();

  groupSequences: number[] = [];
  ruleStrings: string = '';

  constructor(cubeClassroomQueryModel?: DataCubeClassroomQueryModel) {
    super();

    if (cubeClassroomQueryModel) {
      Object.assign(this, {
        ...cubeClassroomQueryModel,
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

decorate(DataCubeClassroomQueryModel, {
  college: observable,
  channel: observable,
  name: observable,
  startDate: observable,
  endDate: observable,
  learningType: observable,
});
