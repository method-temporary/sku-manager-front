import dayjs from 'dayjs';
import { action, computed, observable } from 'mobx';
import { PaidCourseProposalState } from '_data/lecture/students/model/PaidCourseProposalState';
import { PaidCourseQueryModel } from '_data/lecture/students/model/PaidCourseQueryModel';
import { PaidCourseSortOrder } from '_data/lecture/students/model/PaidCourseSortOrder';

class PaidCourseStore {
  static instance: PaidCourseStore;

  @observable
  paidCourseState: PaidCourseQueryModel = {
    startDate: dayjs('2019-12-01').valueOf(),
    endDate: dayjs().valueOf(),
    sortOrder: 'ModifiedTimeDesc',
    limit: 20,
    offset: 0,
  };

  @computed
  get paidCourseQuery(): PaidCourseQueryModel {
    const { limit, offset } = this.paidCourseState;

    return {
      ...this.paidCourseState,
      offset: (offset > 0 ? offset - 1 : offset) * limit,
    };
  }

  @action.bound
  setPaidCourseState(paidCourseState: PaidCourseQueryModel) {
    this.paidCourseState = paidCourseState;
  }

  @action.bound
  setProposalState(proposalState?: PaidCourseProposalState) {
    this.paidCourseState.proposalState = proposalState;
  }

  @action.bound
  setOffset(offset: number) {
    this.paidCourseState.offset = offset;
  }

  @action.bound
  setLimit(limit: number) {
    this.paidCourseState.limit = limit;
  }

  @action.bound
  setSortOrder(sortOrder: PaidCourseSortOrder) {
    this.paidCourseState.sortOrder = sortOrder;
  }

  @action.bound
  setInitPaidCourseState() {
    this.paidCourseState = {
      startDate: dayjs('2019-12-01').valueOf(),
      endDate: dayjs().valueOf(),
      sortOrder: 'ModifiedTimeDesc',
      limit: 20,
      offset: 1,
    };
  }
}

PaidCourseStore.instance = new PaidCourseStore();
export default PaidCourseStore;
