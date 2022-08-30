import { DramaEntity, PatronKey } from '@nara.platform/accent';
import { decorate, observable } from 'mobx';

export class RollBookModel implements DramaEntity {
  //
  id: string = '';
  entityVersion: number = 0;
  patronKey: PatronKey = {} as PatronKey;

  round: number = 0;
  name: string = '';
  lectureCardId: string = '';

  constructor(rollBook: RollBookModel) {
    //
    if (rollBook) {
      Object.assign(this, { ...rollBook });
    }
  }
}

decorate(RollBookModel, {
  id: observable,
  entityVersion: observable,
  patronKey: observable,

  round: observable,
  name: observable,
  lectureCardId: observable,
});
