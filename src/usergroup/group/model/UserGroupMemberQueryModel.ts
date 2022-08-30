import { computed, decorate, observable } from 'mobx';

import { QueryModel } from 'shared/model';

export class UserGroupMemberQueryModel extends QueryModel {
  //
  searchWord: string = '';
  searchPart: string = '';
  companyCode: string = '';

  groupSequences: number[] = [];

  @computed
  get groupSequence() {
    //
    let sequences = '';
    this.groupSequences &&
      this.groupSequences.forEach((seq, index) => {
        index === 0 ? (sequences = seq + '') : (sequences += ',' + seq);
      });

    return sequences;
  }
}

decorate(UserGroupMemberQueryModel, {
  //
  searchWord: observable,
  searchPart: observable,
  companyCode: observable,
});
