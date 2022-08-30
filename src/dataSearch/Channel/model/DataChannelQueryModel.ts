import { computed, decorate, observable } from 'mobx';
import { QueryModel, GroupBasedAccessRule } from 'shared/model';

export class DataChannelQueryModel extends QueryModel {
  //
  College: string = ''; // College
  Channel: string = ''; // Channel

  groupBasedAccessRule: GroupBasedAccessRule = new GroupBasedAccessRule();

  groupSequences: number[] = [];
  ruleStrings: string = '';

  constructor(channelQueryModel?: DataChannelQueryModel) {
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

decorate(DataChannelQueryModel, {
  College: observable,
  Channel: observable,
});
