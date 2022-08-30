import { computed, decorate, observable } from 'mobx';
import { QueryModel, GroupBasedAccessRule } from 'shared/model';

export class DataCardMappingListQueryModel extends QueryModel {
  college: string = '';
  channel: string = '';
  searchPart: string = '';
  name: string = '';
  startDate: number = 0;
  endDate: number = 0;
  learningType: string = '';
  hasStamp: string = ''; // Stamp 획득 여부
  searchSearchable: string = 'SearchOn'; // 공개 / 비공개
  mainCategory: string = 'Y';

  groupBasedAccessRule: GroupBasedAccessRule = new GroupBasedAccessRule();

  groupSequences: number[] = [];
  ruleStrings: string = '';

  constructor(cardMappingListQueryModel?: DataCardMappingListQueryModel) {
    super();

    if (cardMappingListQueryModel) {
      Object.assign(this, {
        ...cardMappingListQueryModel,
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

decorate(DataCardMappingListQueryModel, {
  college: observable,
  channel: observable,
  name: observable,
  startDate: observable,
  endDate: observable,
  learningType: observable,
  hasStamp: observable,
  searchSearchable: observable,
  mainCategory: observable,
});
