import {computed, decorate, observable} from 'mobx';

export class DataCommunityModel {
  //
  id            : string = '';
  email         : string = '';
  title         : string = '';
  userName     : string = '';
  companyName   : string = '';
  departmentName: string = '';
  nickname      : string = '';

  groupSequences: number[] = [];

  constructor(model?: DataCommunityModel) {
    //
    if (model) {
      Object.assign(this, {...model});
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

decorate(DataCommunityModel, {
  email         : observable,
  title         : observable,
  userName     : observable,
  companyName   : observable,
  departmentName: observable,
  nickname      : observable,
});

export default DataCommunityModel;
