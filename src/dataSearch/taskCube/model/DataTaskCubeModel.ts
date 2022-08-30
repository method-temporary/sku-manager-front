import { computed, decorate, observable } from 'mobx';

export class DataTaskCubeModel {
  title : string = '';
  contents : string = '';
  readCount : string = '';
  name : string = '';
  companyName : string = '';
  departmentName : string = '';
  email : string = '';
  registeredTime : string = '';
  
  groupSequences: number[] = [];

  constructor(model?: DataTaskCubeModel) {
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

decorate(DataTaskCubeModel, {
  title : observable,
  contents : observable,
  readCount : observable,
  name : observable,
  companyName : observable,
  departmentName : observable,
  email : observable,
  registeredTime : observable,
});

export default DataTaskCubeModel;
