import { RelatedCard } from '_data/lecture/cards/model/vo';
import CardWithContents from '_data/lecture/cards/model/CardWithContents';

export interface RelatedCardWithInfo extends CardWithContents, RelatedCard {
  //
  accessible: boolean;
}
