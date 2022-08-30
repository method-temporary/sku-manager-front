import { CardSearchableCount } from './CardSearchableCount';
import { CardStateCount } from './CardStateCount';

export class CardCount {
  //
  cardSearchableCount: CardSearchableCount = new CardSearchableCount();
  cardStateCount: CardStateCount = new CardStateCount();
  totalCount: number = 0;

  constructor(cardCount?: CardCount) {
    //
    if (cardCount) {
      Object.assign(this, { ...cardCount });
    }
  }
}
