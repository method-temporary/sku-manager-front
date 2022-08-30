import CardContents from './CardContents';
import Card from './Card';
import { UserIdentity, CardRelatedCount } from './vo';

export default interface CardWithContentsAndRelatedCount {
  card: Card;
  cardContents: CardContents;
  cardRelatedCount: CardRelatedCount;
  cardOperatorIdentity: UserIdentity;
}
