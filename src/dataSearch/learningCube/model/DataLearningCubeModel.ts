import { computed, decorate, observable } from 'mobx';

export class DataLearningCubeModel {
  cardId: string = '';
  cardName: string = '';
  collegeId: string = '';
  collegeName: string = '';
  channelId: string = '';
  channelName: string = '';
  cubeId: string = '';
  cubeName: string = '';
  companyName: string = '';
  departmentName: string = '';
  studentName: string = '';
  email: string = '';
  studentType: string = '';
  learningState: string = '';
  surveyStatus: string = '';
  reportStatus: string = '';
  testStatus: string = '';
  learningTime: number = 0;
  registeredTime: string = '';
  modifiedTime: string = '';
  passedTime: string = '';

  groupSequences: number[] = [];

  constructor(model?: DataLearningCubeModel) {
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

decorate(DataLearningCubeModel, {
  cardId: observable,
  cardName: observable,
  collegeId: observable,
  collegeName: observable,
  channelId: observable,
  channelName: observable,
  cubeId: observable,
  cubeName: observable,
  companyName: observable,
  departmentName: observable,
  studentName: observable,
  email: observable,
  studentType: observable,
  learningState: observable,
  surveyStatus: observable,
  reportStatus: observable,
  testStatus: observable,
  learningTime: observable,
  registeredTime: observable,
  modifiedTime: observable,
  passedTime: observable,
});

export default DataLearningCubeModel;
