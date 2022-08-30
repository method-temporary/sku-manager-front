import { computed, decorate, observable } from 'mobx';

export class DataMetaCardModel {
  collegeId : string = '';
  collegeName : string = '';
  channelId : string = '';
  channelName : string = '';
  twoDepthChannelId : string = '';
  twoDepthChannelName : string = '';
  cardId : string = '';
  cardName : string = '';
  mainCategory: string = '';
  cardType : string = '';
  searchable : string = '';
  difficultyLevel : string = '';
  learningTime : number = 0;
  additionalLearningTime : number = 0;
  useStamp : string = '';
  useWhitelistPolicy : string = '';
  simpleDescription : string = '';
  description : string = '';
  tags : string = '';
  learningDate : string = '';
  useTests : string = '';
  useReport : string = '';
  reportName : string = '';
  reportQuestion : string = '';
  useSurvey : string = '';
  cardStateModifiedTime : string = '';
  studentCount : number = 0;
  studentPassedCount : number = 0;

  groupSequences: number[] = [];

  constructor(model?: DataMetaCardModel) {
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

decorate(DataMetaCardModel, {
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
  difficultyLevel : observable,
  learningTime : observable,
  additionalLearningTime : observable,
  useStamp : observable,
  useWhitelistPolicy : observable,
  simpleDescription : observable,
  description : observable,
  tags : observable,
  learningDate : observable,
  useTests : observable,
  useReport : observable,
  reportName : observable,
  reportQuestion : observable,
  useSurvey : observable,
  cardStateModifiedTime : observable,
  studentCount : observable,
  studentPassedCount : observable,
});

export default DataMetaCardModel;
