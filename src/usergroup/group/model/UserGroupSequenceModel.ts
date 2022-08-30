import { decorate, observable } from 'mobx';

export default class UserGroupSequenceModel {
  //
  sequences: number[] = [];

  constructor(sequences?: number[]) {
    //
    if (sequences) {
      Object.assign(this.sequences, { ...sequences });
    }
  }
}

decorate(UserGroupSequenceModel, {
  sequences: observable,
});
