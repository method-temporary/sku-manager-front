import { computed, decorate, observable } from 'mobx';

export class DataMetaCubeModel {
  collegeId : string = '';
  collegeName : string = '';
  channelId : string = '';
  channelName : string = '';
  twoDepthChannelId : string = '';
  twoDepthChannelName : string = '';
  cubeId : string = '';
  cubeName : string = '';
  mainCategory : string = '';
  cubeType : string = '';
  difficultyLevel : string = '';
  learningTime : number = 0;
  goal : string = '';
  applicants : string = '';
  completionTerms : string = '';
  guide : string = '';
  description : string = '';
  institute : string = '';
  tags : string = '';
  useTests : string = '';
  useReport : string = '';
  reportName : string = '';
  reportQuestion : string = '';
  useSurvey : string = '';
  registeredTime : string = '';
  panoptoSessionId : string = '';
  panoptoName : string = '';
  studentCount : number = 0;
  studentPassedCount : number = 0;

  groupSequences: number[] = [];

  constructor(model?: DataMetaCubeModel) {
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

decorate(DataMetaCubeModel, {
  collegeId : observable,
  collegeName : observable,
  channelId : observable,
  channelName : observable,
  twoDepthChannelId : observable,
  twoDepthChannelName : observable,
  cubeId : observable,
  cubeName : observable,
  mainCategory : observable,
  cubeType : observable,
  difficultyLevel : observable,
  learningTime : observable,
  goal : observable,
  applicants : observable,
  completionTerms : observable,
  guide : observable,
  description : observable,
  institute : observable,
  tags : observable,
  useTests : observable,
  useReport : observable,
  reportName : observable,
  reportQuestion : observable,
  useSurvey : observable,
  registeredTime : observable,
  panoptoSessionId : observable,
  panoptoName : observable,
  studentCount : observable,
  studentPassedCount : observable,
});

export default DataMetaCubeModel;
