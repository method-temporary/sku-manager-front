import { decorate, observable } from 'mobx';

export class CardCategory {
  //
  collegeId: string = '';
  channelId: string = '';
  twoDepthChannelId: string | null = null;
  mainCategory: boolean = false;

  constructor(cardCategory?: CardCategory) {
    //
    if (cardCategory) {
      Object.assign(this, { ...cardCategory });
    }
  }
}

decorate(CardCategory, {
  collegeId: observable,
  channelId: observable,
  twoDepthChannelId: observable,
  mainCategory: observable,
});
