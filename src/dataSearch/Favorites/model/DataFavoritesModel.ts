import {computed, decorate, observable} from 'mobx';

export class DataFavoritesModel {
  //
  id            : string = '';
  email         : string = '';
  name          : string = '';
  category      : string = '';
  collegeId     : string = '';
  collegeName   : string = '';
  channelId     : string = '';
  channelName   : string = '';

  groupSequences: number[] = [];

  constructor(model?: DataFavoritesModel) {
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

decorate(DataFavoritesModel, {
  email        : observable,
  name         : observable,
  category     : observable,
  collegeId    : observable,
  collegeName  : observable,
  channelId    : observable,
  channelName  : observable,
});

export default DataFavoritesModel;
