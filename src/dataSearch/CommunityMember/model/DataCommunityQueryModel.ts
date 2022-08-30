import { computed, decorate, observable } from 'mobx';
import { QueryModel, GroupBasedAccessRule } from 'shared/model';

export class DataCommunityQueryModel extends QueryModel {
  //
  CommunityCode: string = '';
  groupBasedAccessRule: GroupBasedAccessRule = new GroupBasedAccessRule();

  groupSequences: number[] = [];
  ruleStrings: string = '';

  constructor(channelQueryModel?: DataCommunityQueryModel) {
    //
    super();

    if (channelQueryModel) {
      Object.assign(this, {
        ...channelQueryModel,
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

decorate(DataCommunityQueryModel, {
  CommunityCode: observable,
});
