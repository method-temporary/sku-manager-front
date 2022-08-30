
export interface OffsetElementListForExam<T> {
  //
  results: T[];
  _metadata: {limit: number, offset: number, totalCount: number };
}
