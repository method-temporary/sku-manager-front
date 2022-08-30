import { CardWithContents } from './CardWithContents';

export class CardWithAccessRuleResult {
  //
  cardWithContents: CardWithContents = new CardWithContents();
  accessible: boolean = false;

  constructor(result?: CardWithAccessRuleResult) {
    //
    if (result) {
      const cardWithContents = new CardWithContents(result.cardWithContents);
      Object.assign(this, { ...result, cardWithContents });
    }
  }
}
