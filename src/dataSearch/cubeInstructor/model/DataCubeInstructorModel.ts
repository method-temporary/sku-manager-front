import { computed, decorate, observable } from 'mobx';

export class DataCubeInstructorModel {
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
  learningTime : number = 0;
  instructorName : string = '';
  instructorEmail : string = '';
  representative : string = '';

  groupSequences: number[] = [];

  constructor(model?: DataCubeInstructorModel) {
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

decorate(DataCubeInstructorModel, {
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
  learningTime : observable,
  instructorName : observable,
  instructorEmail : observable,
  representative : observable,
});

export default DataCubeInstructorModel;
