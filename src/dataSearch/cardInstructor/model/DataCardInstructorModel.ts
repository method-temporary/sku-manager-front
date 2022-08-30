import { computed, decorate, observable } from 'mobx';

export class DataCardInstructorModel {
  collegeId : string = '';
  collegeName : string = '';
  channelId : string = '';
  channelName : string = '';
  twoDepthChannelId : string = '';
  twoDepthChannelName : string = '';
  cardId : string = '';
  cardName : string = '';
  mainCategory : string = '';
  cardType : string = '';
  searchable : string = '';
  learningTime : number = 0;
  additionalLearningTime : number = 0;
  instructorName : string = '';
  instructorEmail : string = '';
  representative : string = '';

  groupSequences: number[] = [];

  constructor(model?: DataCardInstructorModel) {
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

decorate(DataCardInstructorModel, {
  collegeId : observable,
  collegeName : observable,
  channelId : observable,
  channelName : observable,
  twoDepthChannelId : observable,
  twoDepthChannelName : observable,
  cardId : observable,
  cardName : observable,
  mainCategory : observable,
  cardType : observable,
  searchable : observable,
  learningTime : observable,
  additionalLearningTime : observable,
  instructorName : observable,
  instructorEmail : observable,
  representative : observable,
});

export default DataCardInstructorModel;
