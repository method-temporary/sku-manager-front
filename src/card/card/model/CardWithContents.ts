import { decorate, observable } from 'mobx';

import { CardModel } from './CardModel';
import { CardContentsModel } from './CardContentsModel';
import { CardRelatedCount } from './vo/CardRelatedCount';
import { CardOperatorIdentity } from './vo/CardOperatorIdentity';

export class CardWithContents {
  //
  card: CardModel = new CardModel();
  cardContents: CardContentsModel = new CardContentsModel();
  cardRelatedCount: CardRelatedCount = new CardRelatedCount();
  cardOperatorIdentity: CardOperatorIdentity = new CardOperatorIdentity();

  constructor(cardWithContents?: CardWithContents) {
    //
    if (cardWithContents) {
      const card = new CardModel(cardWithContents.card);
      const cardContents = new CardContentsModel(cardWithContents.cardContents);
      const cardRelatedCount = new CardRelatedCount(cardWithContents.cardRelatedCount);
      const cardOperatorIdentity = new CardOperatorIdentity(cardWithContents.cardOperatorIdentity);

      Object.assign(this, { card, cardContents, cardRelatedCount, cardOperatorIdentity });
    }
  }
}

decorate(CardWithContents, {
  card: observable,
  cardContents: observable,
  cardRelatedCount: observable,
});
