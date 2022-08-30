import { computed, decorate, observable } from 'mobx';

export class DataCubeClassroomModel {
  cubeId : string = '';
  cubeName : string = '';
  type : string = '';
  applyingDate : string = '';
  learningDate : string = '';
  cancellableDate : string = '';
  penalty : string = '';
  capacity : string = '';
  freeOfCharge : string = '';
  chargeAmount : string = '';
  enrollingAvailable : string = '';
  approvalProcess : string = '';
  sendingMail : string = '';
  round : string = '';
  
  groupSequences: number[] = [];

  constructor(model?: DataCubeClassroomModel) {
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

decorate(DataCubeClassroomModel, {
  cubeId : observable,
  cubeName : observable,
  type : observable,
  applyingDate : observable,
  learningDate : observable,
  cancellableDate : observable,
  penalty : observable,
  capacity : observable,
  freeOfCharge : observable,
  chargeAmount : observable,
  enrollingAvailable : observable,
  approvalProcess : observable,
  sendingMail : observable,
  round : observable,
});

export default DataCubeClassroomModel;
