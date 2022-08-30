import { action, observable, runInAction } from 'mobx';
import autobind from 'autobind-decorator';
import moment from 'moment';
import _ from 'lodash';

import { encodingUrlBrackets } from 'shared/helper';

import { searchExamPapers } from 'exam/api/examApi';
import { ExamPaperAdminRdo } from 'exam/model/sdo/ExamPaperAdminRdo';
import { ExamQueryModel } from '../../model/ExamQueryModel';
import { OffsetElementListForExam } from '../../model/OffsetElementListForExam';
import { ExamModel } from '../..';

@autobind
export default class ExamService {
  //
  static instance: ExamService;

  // 단수 선택
  @observable
  exam: ExamModel = new ExamModel();

  // 복수 선택
  @observable
  selectedExams: ExamModel[] = [];

  @observable
  exams: OffsetElementListForExam<ExamModel> = { results: [], _metadata: { limit: 0, offset: 0, totalCount: 0 } };

  @observable
  examQuery: ExamQueryModel = new ExamQueryModel();

  @observable
  examListModalOpen: boolean = false;

  // @observable
  // examinationCdo: ExaminationCdoModel = new ExaminationCdoModel();

  // @observable
  // examinationCdoList: ExaminationCdoModel[] = [];

  @observable
  examinationId: string = '';

  // @observable
  // examination: ExaminationCdoModel = new ExaminationCdoModel();

  // @action
  // changeExaminationCdoProps(name: string, value: string | number) {
  //   //
  //   this.examinationCdo = _.set(this.examinationCdo, name, value);
  // }

  // @action
  // changeExaminationCdoListProps(
  //   index: number,
  //   name: string,
  //   value: string | Date | boolean,
  //   nameSub?: string,
  //   valueSub?: string
  // ) {
  //   //
  //   this.examinationCdoList = _.set(this.examinationCdoList, `classroomCdos[${index}].${nameSub}`, valueSub);
  // }

  @action
  async findAllExams() {
    const examPaperAdminRdo: ExamPaperAdminRdo = {
      title: this.examQuery.searchType === 'T' ? encodingUrlBrackets(this.examQuery.keyword) : '',
      authorName: this.examQuery.searchType === 'C' ? this.examQuery.keyword : '',
      questionSelectionType: '',
      finalCopy: this.examQuery.finalCopy,
      offset: this.examQuery.offset,
      limit: this.examQuery.limit,
    };
    const offsetExamPaper = await searchExamPapers(examPaperAdminRdo);
    if (offsetExamPaper === undefined || offsetExamPaper.results === undefined) {
      return;
    }

    const exams: ExamModel[] = offsetExamPaper.results.map((result) => {
      return {
        authorId: '',
        authorName: result.authorName,
        questionSelectionType: result.questionSelectionType,
        successPoint: result.successPoint,
        totalPoint: result.totalPoint,
        finalCopy: result.finalCopy,
        finalCopyKr: result.finalCopy === true ? '최종본' : '수정가능본',
        id: result.id,
        questions: [],
        registDate: moment(result.time).format('YYYY-MM-DD'),
        title: result.title,
        year: '',
        multipleChoicePoint: 0,
        assayPoint: 0,
      };
    });

    runInAction(
      () =>
        (this.exams = {
          results: exams,
          _metadata: {
            offset: this.examQuery.offset,
            limit: this.examQuery.limit,
            totalCount: offsetExamPaper.totalCount,
          },
        })
    );
  }

  // @action
  // async findExam(examId: string) {
  //   //
  //   const exam = await this.examApi.findExam(examId);
  //   runInAction(() => (this.exam = exam));
  //   return exam;
  // }

  // @action
  // async findExamIds(examIds: string[]) {
  //   //
  //   const exams = await this.examApi.findExamIds(examIds);

  //   const result: any[] = [];
  //   runInAction(() => {
  //     exams.map((exam) => {
  //       result.push(exam.result);
  //     });
  //   });

  //   return result;
  // }

  @action
  changeExamProps(name: string, value: string) {
    //
    this.exam = _.set(this.exam, name, value);
  }

  @action
  changeExamListModalOpen(open: boolean) {
    //
    this.examListModalOpen = open;
  }

  @action
  setSelectedExam(selectedExam: ExamModel[]) {
    this.selectedExams = selectedExam;
  }

  @action
  appendSelectedExam(selectedExam: ExamModel) {
    //
    this.selectedExams.push(selectedExam);
  }

  @action
  removeSelectedExam(id: String) {
    const nextSelectedExams = this.selectedExams.filter((e) => e.id !== id);
    this.selectedExams = nextSelectedExams;
  }

  @action
  clearExam() {
    //
    this.exam = new ExamModel();
  }

  @action
  clearExams() {
    //
    (this.selectedExams as any).clear();
  }

  @action
  changeExamQueryProps(name: string, value: string | number) {
    //
    if (value === '전체') value = '';
    this.examQuery = _.set(this.examQuery, name, value);
  }

  @action
  addExamChoicePoint(value: number) {
    //
    this.exam = _.set(this.exam, 'multipleChoicePoint', this.exam.multipleChoicePoint + value);
  }

  @action
  addExamAssayPoint(value: number) {
    //
    this.exam = _.set(this.exam, 'assayPoint', this.exam.assayPoint + value);
  }
}

Object.defineProperty(ExamService, 'instance', {
  value: new ExamService(),
  writable: false,
  configurable: false,
});
