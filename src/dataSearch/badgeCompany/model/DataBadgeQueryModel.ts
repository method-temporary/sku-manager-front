import { computed, decorate, observable } from 'mobx';
import { QueryModel, GroupBasedAccessRule } from 'shared/model';

export class DataBadgeQueryModel extends QueryModel {
  //
  Date: string = ''; // 조회일자.
  CompanyCode: string = ''; // 회사코드

  groupBasedAccessRule: GroupBasedAccessRule = new GroupBasedAccessRule();

  groupSequences: number[] = [];
  ruleStrings: string = '';

  constructor(dataBadgeQuery?: DataBadgeQueryModel) {
    //
    super();

    if (dataBadgeQuery) {
      Object.assign(this, {
        ...dataBadgeQuery,
      });
    }
  }

  @computed
  get sequences() {
    //
    let sequences = '';
    this.groupSequences.map((seq, index) => (index === 0 ? (sequences = seq + '') : (sequences += ',' + seq)));

    return sequences;
  }
}

decorate(DataBadgeQueryModel, {
  Date: observable,
  CompanyCode: observable,
});
