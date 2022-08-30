import { CpHistoryQdo } from '../../../../_data/contentProvider/cpHistories/model/CpHistoryQdo';
import { action, observable } from 'mobx';

interface CourseraHistorySearchParams extends CpHistoryQdo {}

class CourseraHistoryPageStore {
  static instance: CourseraHistoryPageStore;

  @observable
  offset: number = 1;

  @observable
  limit: number = 20;

  @observable
  params: CourseraHistorySearchParams = {
    limit: 20,
    offset: 0,
  };

  @action.bound
  setLimit(limit: number): void {
    this.limit = limit;
  }

  @action.bound
  setOffset(offset: number): void {
    this.offset = offset;
  }

  @action.bound
  setParams(): void {
    this.params = {
      offset: (this.offset - 1) * this.limit,
      limit: this.limit,
    };
  }
}

CourseraHistoryPageStore.instance = new CourseraHistoryPageStore();
export default CourseraHistoryPageStore;
