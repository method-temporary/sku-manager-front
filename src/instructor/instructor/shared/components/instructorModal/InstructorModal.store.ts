import { action, observable } from 'mobx';
import { InstructorWithOptional } from './model/InstructorWithOptional';
import { getInitInstructorSdo, InstructorSdo } from '../../../../../_data/user/instructors/model/InstructorSdo';
import { InstructorDetailRdo } from '../../../../../_data/user/instructors/model/InstructorDetailRdo';

class InstructorModalStore {
  //
  static instance: InstructorModalStore;

  @observable
  searchType: string = '';

  @observable
  searchWord: string = '';

  @observable
  offset: number = 1;

  @observable
  limit: number = 10;

  @observable
  instructorSdo: InstructorSdo = getInitInstructorSdo();

  @observable
  selectedInstructors: InstructorWithOptional[] = [];

  @action.bound
  setSearchType(searchType: string) {
    this.searchType = searchType;
  }

  @action.bound
  setSearchWord(searchWord: string) {
    this.searchWord = searchWord;
  }

  @action.bound
  setOffset(offset: number) {
    this.offset = offset;
  }

  @action.bound
  setSelectedInstructors(selectedInstructors: InstructorWithOptional[]) {
    this.selectedInstructors = selectedInstructors;
  }

  @action.bound
  setInstructorSdo() {
    //
    this.instructorSdo = {
      ...this.instructorSdo,
      name: this.searchWord,
      internal: this.searchType === '' ? undefined : this.searchType === 'I',
      limit: this.limit,
      offset: (this.offset - 1) * this.limit,
    };
  }

  @action.bound
  setInstructorPageSdo() {
    //
    this.instructorSdo = {
      ...this.instructorSdo,
      limit: this.limit,
      offset: (this.offset - 1) * this.limit,
    };
  }

  @action.bound
  reset() {
    //
    this.searchType = '';
    this.searchWord = '';
    // this.examPaperAdminRdo = getInitExamPaperAdminRdo();
    this.selectedInstructors = [];
    this.offset = 1;
    this.limit = 10;
  }
}

InstructorModalStore.instance = new InstructorModalStore();
export default InstructorModalStore;
