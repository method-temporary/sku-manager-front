export function getItemNo(totalCount: number, offset: number, index: number, itemsLength: number) {
  if (totalCount - offset < itemsLength) {
    return itemsLength - index;
  }

  return totalCount - offset - index;
}
