import CardContents from './CardContents';
import Card from './Card';

export default interface CardWithContents {
  card: Card;
  cardContents: CardContents;
}
