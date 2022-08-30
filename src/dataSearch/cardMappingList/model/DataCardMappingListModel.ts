import { computed, decorate, observable } from 'mobx';

export class DataCardMappingListModel {
  cardId : string = '';
  cardName : string = '';
  cardType : string = '';
  cardCollegeName : string = '';
  cardChannelName : string = '';
  cardTwoDepthChannelName : string = '';
  cardSearchable : string = '';
  mappingCubeCount : number = 0;
  listOrder : string = '';
  cubeId : string = '';
  cubeName : string = '';
  cubeType : string = '';
  cubeCollegeName : string = '';
  cubeChannelName : string = '';
  cubeTwoDepthChannelName : string = '';
  subCubeCategory : string = '';
  mappingCardCount : number = 0;

  groupSequences: number[] = [];

  constructor(model?: DataCardMappingListModel) {
    if (model) {
      Object.assign(this, { ...model });
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

decorate(DataCardMappingListModel, {
  cardId : observable,
  cardName : observable,
  cardType : observable,
  cardCollegeName : observable,
  cardChannelName : observable,
  cardTwoDepthChannelName : observable,
  cardSearchable : observable,
  mappingCubeCount : observable,
  listOrder : observable,
  cubeId : observable,
  cubeName : observable,
  cubeType : observable,
  cubeCollegeName : observable,
  cubeChannelName : observable,
  cubeTwoDepthChannelName : observable,
  subCubeCategory : observable,
  mappingCardCount : observable,
});

export default DataCardMappingListModel;
