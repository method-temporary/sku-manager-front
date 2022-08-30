import { CardService } from 'card';
import { action, computed, observable } from 'mobx';
import { AutoEncourageExcludedStudentCdo } from '_data/lecture/autoEncourageExcludedStudents/model/AutoEncourageExcludedStudentCdo';
import { AutoEncourageExcludedStudentParams } from '_data/lecture/autoEncourageExcludedStudents/model/AutoEncourageExcludedStudentParams';
import AutoEncourageStore from '../autoEncourage.store';

export type SearchType = '성명' | 'E-mail';

class ExclusionManagementTabStore {
  static instance: ExclusionManagementTabStore;

  @observable
  searchType: SearchType = '성명';

  @observable
  searchText: string = '';

  @observable
  offset: number = 0;

  @observable
  limit: number = 20;

  @observable
  selectedStudents: string[] = [];

  @observable
  emailsWithCardId: AutoEncourageExcludedStudentCdo[] = [];

  @observable
  isResiterModalOpen: boolean = false;

  @observable
  excelModalFileName: string = '';

  @computed
  get autoEncourageExcludedStudentParams(): AutoEncourageExcludedStudentParams {
    const email = this.searchType === 'E-mail' ? this.searchText : '';
    const name = this.searchType === '성명' ? this.searchText : '';

    return {
      cardId: AutoEncourageStore.instance.cardId,
      email,
      name,
      limit: this.limit,
      offset: this.offset,
    };
  }

  @action.bound
  setSearchText(searchtext: string) {
    this.searchText = searchtext;
  }

  @action.bound
  setSearchType(type: SearchType) {
    this.searchType = type;
  }

  @action.bound
  setLimit(limit: number) {
    this.limit = limit;
  }

  @action.bound
  setOffset(offset: number) {
    this.offset = offset;
  }

  @action.bound
  setSelectedStudents(studentIds: string[]) {
    this.selectedStudents = studentIds;
  }
}

ExclusionManagementTabStore.instance = new ExclusionManagementTabStore();
export default ExclusionManagementTabStore;
