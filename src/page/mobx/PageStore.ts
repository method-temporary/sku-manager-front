import { observable, action, computed } from 'mobx';
import { NaOffsetElementList, getEmptyNaOffsetElementList } from 'shared/model';
import Page, { getEmptyPage } from '../model/Page';

class PageStore {
  static instance: PageStore;

  @observable
  innerPageList: NaOffsetElementList<Page> = getEmptyNaOffsetElementList();

  @action
  setPageList(next: NaOffsetElementList<Page>) {
    this.innerPageList = next;
  }

  @computed
  get pageList() {
    return this.innerPageList;
  }

  @observable
  innerSelected: Page = getEmptyPage();

  @action
  select(next: Page) {
    this.innerSelected = next;
  }

  @computed
  get selected() {
    return this.innerSelected;
  }
}

PageStore.instance = new PageStore();

export default PageStore;
