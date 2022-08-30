import { NaOffsetElementList, getEmptyNaOffsetElementList } from '../model/NaOffsetElementList';
import OffsetElementList from '../model/OffsetElementList';

export function responseToNaOffsetElementList<T>(response: any): NaOffsetElementList<T> {
  //
  if (response && response.data) {
    const {
      results = [],
      empty = true,
      totalCount = 0,
      title = null,
    }: {
      results: T[];
      empty: boolean;
      totalCount: number;
      title: string | null;
    } = response.data;
    return {
      ...getEmptyNaOffsetElementList<T>(),
      results,
      empty,
      totalCount,
      title,
    };
  }
  return getEmptyNaOffsetElementList<T>();
}

export function responseToOffsetElementList<T>(response: any): OffsetElementList<T> {
  //
  if (response && response.data) {
    return new OffsetElementList<T>(response.data);
  } else {
    return OffsetElementList.newEmpty();
  }
}
