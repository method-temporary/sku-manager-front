import { decorate, observable } from 'mobx';

export class CardStampModel {
  //
  hasStamp: string = ''; // Stamp 획득 여부
  stampReady: boolean = true;
  stampCount: number = 1;

  constructor(cardStampModel?: CardStampModel) {
    if (cardStampModel) {
      Object.assign(this, { ...cardStampModel });
    }
  }
}

decorate(CardStampModel, {
  hasStamp: observable,
  stampReady: observable,
  stampCount: observable,
});
