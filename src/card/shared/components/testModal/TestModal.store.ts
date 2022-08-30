import { action, observable } from 'mobx';
import { ExamPaperAdminRdo, getInitExamPaperAdminRdo } from 'exam/model/sdo/ExamPaperAdminRdo';
import { ExamPaperModel } from 'exam/model/ExamPaperModel';

class TestModalStore {
  //
  static instance: TestModalStore;

  @observable
  searchType: string = '';

  @observable
  searchWord: string = '';

  @observable
  examPaperAdminRdo: ExamPaperAdminRdo = getInitExamPaperAdminRdo();

  @observable
  selectedExamPapers: ExamPaperModel[] = [];

  @observable
  offset: number = 1;

  @observable
  limit: number = 10;

  @action.bound
  setSearchType(searchType: string) {
    this.searchType = searchType;
  }

  @action.bound
  setSearchWord(searchWord: string) {
    this.searchWord = searchWord;
  }

  @action.bound
  setSelectedExamPapers(selectedExamPaper: ExamPaperModel[]) {
    this.selectedExamPapers = selectedExamPaper;
  }

  @action.bound
  setOffset(offset: number) {
    this.offset = offset;
  }

  @action.bound
  setExamPaperAdminRdo() {
    //
    this.examPaperAdminRdo = {
      ...this.examPaperAdminRdo,
      title: this.searchType === 'T' ? this.searchWord : '',
      authorName: this.searchType === 'C' ? this.searchWord : '',
      limit: this.limit,
      offset: (this.offset - 1) * this.limit,
    };
  }

  @action.bound
  reset() {
    //
    this.searchType = '';
    this.searchWord = '';
    this.examPaperAdminRdo = getInitExamPaperAdminRdo();
    this.selectedExamPapers = [];
    this.offset = 1;
    this.limit = 10;
  }
}

TestModalStore.instance = new TestModalStore();
export default TestModalStore;
