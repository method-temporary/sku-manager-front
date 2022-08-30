import { decorate, observable } from 'mobx';

export class SequenceModel {
  index: number = 0;
  groupNumber: string = '';
  number: string = '';

  constructor(sequence?: SequenceModel) {
    //
    if (sequence) {
      Object.assign(this, { ...sequence });
    }
  }

  toSequenceString() {
    return this.index + '-' + this.groupNumber + '-' + this.number;
  }
}

decorate(SequenceModel, {
  index: observable,
  groupNumber: observable,
  number: observable,
});
