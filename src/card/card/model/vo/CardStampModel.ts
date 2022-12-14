import { decorate, observable } from 'mobx';

export class CardStampModel {
  //
  hasStamp: string = ''; // Stamp νλ μ¬λΆ
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
