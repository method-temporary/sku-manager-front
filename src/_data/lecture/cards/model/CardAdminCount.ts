import { CardSearchableCount, getInitCardSearchableCount, CardStateCount, getInitCardStateCount } from './vo';

export default interface CardAdminCount {
  cardSearchableCount: CardSearchableCount;
  cardStateCount: CardStateCount;
  totalCardCount: number;
}

export function getInitCardAdminCount(): CardAdminCount {
  return {
    cardSearchableCount: getInitCardSearchableCount(),
    cardStateCount: getInitCardStateCount(),
    totalCardCount: 0,
  };
}
