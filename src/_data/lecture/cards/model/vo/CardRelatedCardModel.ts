import { decorate, observable } from 'mobx';

export class CardRelatedCardModel {
  //
  id: string = '';
  relatedCardId: string = '';
  cardId: string = '';
  entityOrder: number = 0;

  constructor(cardRelatedCardModel?: CardRelatedCardModel) {
    //
    if (cardRelatedCardModel) {
      Object.assign(this, { ...cardRelatedCardModel });
    }
  }
}

decorate(CardRelatedCardModel, {
  id: observable,
  relatedCardId: observable,
  cardId: observable,
  entityOrder: observable,
});
