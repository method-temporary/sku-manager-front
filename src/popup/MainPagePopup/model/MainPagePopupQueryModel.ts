import { computed, decorate, observable } from 'mobx';
import { GroupBasedAccessRule, QueryModel } from 'shared/model';

export class MainPagePopupQueryModel extends QueryModel {
  //
  title: string = ''; // 제목

  groupBasedAccessRule: GroupBasedAccessRule = new GroupBasedAccessRule();
  groupSequences: number[] = [];

  ruleStrings: string = '';

  constructor(mainPagePopupQuery?: MainPagePopupQueryModel) {
    //
    super();

    if (mainPagePopupQuery) {
      Object.assign(this, { ...mainPagePopupQuery });
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

decorate(MainPagePopupQueryModel, {
  title: observable,
});
