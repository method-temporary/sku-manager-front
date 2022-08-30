import { observable, action, runInAction } from 'mobx';

import { autobind } from '@nara.platform/accent';

import { IconModel, IdName, FileUploadType, SortFilterState, CardIconType, PageModel, FileModel } from '../../model';

import SharedApi from '../apiclient/sharedApi';

@autobind
export class SharedService {
  //
  static instance: SharedService;

  sharedApi: SharedApi;

  /* PageModel을 이미 any로 사용하고 있는곳이 많아서 타입에 any도 포함 */
  @observable
  pageMap = new Map<string, PageModel | any>();

  @observable
  headerActiveItem: string = '';

  @observable
  viewPivotable: boolean = false;

  /* Page ------------------------------------------------------------------- */

  constructor(sharedApi: SharedApi) {
    //
    this.sharedApi = sharedApi;
  }

  getPageModel(key: string): PageModel {
    //
    if (!this.pageMap.get(key)) {
      this.pageMap.set(key, new PageModel());
    }

    return this.pageMap.get(key);
  }

  @action
  init(key: string, offset: number, limit?: number, sortFilter?: SortFilterState) {
    this.pageMap.set(key, new PageModel(offset, limit, sortFilter));
  }

  @action
  setInitDate(key: string, offset: number, limit?: number, sortFilter?: SortFilterState) {
    const pageMap = this.pageMap.get(key);

    this.pageMap.set(key, { ...pageMap, offset, limit, sortFilter });
  }

  @action
  setPageMap(key: string, offset: number, limit: number) {
    this.pageMap.set(key, new PageModel(offset, limit));
  }

  @action
  setCount(key: string, count: number) {
    const pageSet = { ...this.pageMap.get(key) } as PageModel;
    if (!pageSet) {
      return;
    }

    pageSet.count = count;
    pageSet.totalPages = Math.ceil(count / pageSet.limit);
    pageSet.startNo = count - pageSet.offset;

    this.pageMap.set(key, pageSet);
  }

  @action
  setPage(key: string, page: number) {
    const pageSet = { ...this.pageMap.get(key) } as PageModel;
    if (!pageSet) {
      return;
    }

    pageSet.offset = (page - 1) * pageSet.limit;
    pageSet.page = page;

    this.pageMap.set(key, pageSet);
  }

  @action
  setSortFilter(key: string, sortFilter: SortFilterState) {
    //
    const pageSet = { ...this.pageMap.get(key) } as PageModel;
    if (!pageSet) {
      return;
    }

    pageSet.sortFilter = sortFilter;

    this.pageMap.set(key, pageSet);
  }

  @action
  setHeaderActiveItem(activeItem: string) {
    //
    this.headerActiveItem = activeItem;
  }

  @action
  setViewPivotable() {
    //
    this.viewPivotable = !this.viewPivotable;
  }

  @action
  uploadFile(file: File, type: FileUploadType) {
    //
    const formDate = new FormData();

    formDate.append('file', file);

    return this.sharedApi.uploadFile(formDate, type);
  }

  @action
  findFile(path: string): FileModel {
    //
    return new FileModel(this.sharedApi.findFile(path));
  }
}

SharedService.instance = new SharedService(SharedApi.instance);
export default SharedService.instance;
