export interface CardSearchableCount {
  searchableCount: number;
  unsearchableCount: number;
}

export function getInitCardSearchableCount(): CardSearchableCount {
  return {
    searchableCount: 0,
    unsearchableCount: 0,
  };
}
