import { decorate, observable } from 'mobx';

export class CardSearchableCount {
  //
  searchableCount: number = 0;
  unsearchableCount: number = 0;
}

decorate(CardSearchableCount, {
  searchableCount: observable,
  unsearchableCount: observable,
});
