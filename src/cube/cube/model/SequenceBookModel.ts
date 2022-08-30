import { DramaEntityObservableModel } from 'shared/model';
import { decorate, observable } from 'mobx';

export class SequenceBookModel extends DramaEntityObservableModel {
  //
  static SINGLETON_ID: string = '1';
  static CUBE_PREFIX: string = 'CUBE';

  cubeSequence: number = 0;

  constructor(sequenceBook?: SequenceBookModel) {
    super();
    if (sequenceBook) {
      Object.assign(this, { ...sequenceBook });
    }
  }
}

decorate(SequenceBookModel, {
  cubeSequence: observable,
});
