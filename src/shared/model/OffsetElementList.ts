import { decorate, observable } from 'mobx';

class OffsetElementList<T> {
  //
  results: T[] = [];
  empty: boolean = false;
  totalCount: number = 0;

  constructor(offsetElementList?: OffsetElementList<T>) {
    //
    if (offsetElementList) {
      Object.assign(this, offsetElementList);
    }
  }

  static newEmpty<T>(): OffsetElementList<T> {
    //
    return new OffsetElementList<T>();
  }

  static fromResponse<T>(responseData: any): OffsetElementList<T> {
    //
    if (responseData) {
      return new OffsetElementList<T>(responseData);
    } else {
      return this.newEmpty();
    }
  }
}

decorate(OffsetElementList, {
  results: observable,
  empty: observable,
  totalCount: observable,
});

export default OffsetElementList;
