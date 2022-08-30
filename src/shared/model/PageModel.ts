import { SortFilterState } from './SortFilterState';

export default class PageModel {
  offset: number;
  limit: number;
  count: number;
  page: number;
  totalPages: number;
  sortFilter: SortFilterState;
  startNo: number;
  pivotable: boolean;

  constructor(offset: number = 0, limit: number = 20, sortFilter?: SortFilterState) {
    this.offset = offset;
    this.limit = limit;
    this.count = 0;
    this.page = 1;
    this.totalPages = 1;
    this.sortFilter = sortFilter || SortFilterState.TimeDesc;
    this.startNo = 0;
    this.pivotable = false;
  }
}
