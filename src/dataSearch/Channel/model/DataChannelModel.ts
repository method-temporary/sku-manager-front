import {computed, decorate, observable} from 'mobx';

export class DataChannelModel {
  //
  id               : string = '';
  email            : string = '';
  companyName      : string = '';
  departmentName   : string = '';
  name             : string = '';
  channelName      : string = '';

  groupSequences: number[] = [];

  constructor(model?: DataChannelModel) {
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

decorate(DataChannelModel, {
  email         : observable,
  companyName   : observable,
  departmentName: observable,
  name          : observable,
  channelName   : observable,
});

export default DataChannelModel;
