import { computed, decorate, observable } from 'mobx';
import { QueryModel } from 'shared/model';
import { GroupBasedAccessRule } from 'shared/model/GroupBasedAccessRule';

export class DataCardInstructorQueryModel extends QueryModel {
  college: string = '';
  channel: string = '';
  searchPart: string = '';
  name: string = '';
  learningType: string = ''
  searchSearchable: string = 'SearchOn'; // 공개 / 비공개
  mainCategory: string = 'Y';

  groupBasedAccessRule: GroupBasedAccessRule = new GroupBasedAccessRule();

  groupSequences: number[] = [];
  ruleStrings: string = '';

  constructor(cardInstructorQueryModel?: DataCardInstructorQueryModel) {
    super();

    if (cardInstructorQueryModel) {
      Object.assign(this, {
        ...cardInstructorQueryModel,
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

decorate(DataCardInstructorQueryModel, {
  college: observable,
  channel: observable,
  name: observable,
  learningType: observable,
  searchSearchable:observable,
  mainCategory:observable,
});
