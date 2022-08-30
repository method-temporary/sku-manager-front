import { observable } from 'mobx';
import { OffsetElementList } from '@nara.platform/accent';
import autobind from 'autobind-decorator';
import { StudentCdoModel } from '../../model/StudentCdoModel';
import { StudentQueryModel } from '../../model/StudentQueryModel';
import { StudentCountRdoModel } from '../../model/StudentCountRdoModel';
import { StudentRequestCdoModel } from '../../model/StudentRequestCdoModel';
import { StudentTestCountRdoModel } from '../../model/StudentTestCountRdoModel';
import { LearningStateUdoModel } from '../../model/LearningStateUdoModel';
import { ExcelReadCountRdoModel } from '../../model/ExcelReadCountRdoModel';
import { StudentListViewModel } from '../../model/StudentListViewModel';
import { StudentReportUdoModel } from '../../model/StudentReportUdoModel';

// Master 추가 Import
import { StudentForGradeSheet } from 'lecture/student/model/StudentForGradeSheetModel';

@autobind
export default class StudentService {
  //
  static instance: StudentService;

  @observable
  //students: OffsetElementList<StudentModel> = { results: [], totalCount: 0 };
  students: OffsetElementList<StudentListViewModel> = {
    results: [],
    totalCount: 0,
  };

  @observable
  studentRequest: StudentRequestCdoModel = {} as StudentRequestCdoModel;

  @observable
  studentLearningState: LearningStateUdoModel = {} as LearningStateUdoModel;

  @observable
  studentQuery: StudentQueryModel = new StudentQueryModel();

  @observable
  selectedList: string[] = [];

  @observable
  selectedEmailList: string[] = [];

  // Master 추가 Code
  @observable
  selectedNameList: string[] = [];

  @observable
  studentCount: StudentCountRdoModel = {} as StudentCountRdoModel;

  @observable
  studentTestCount: StudentTestCountRdoModel = {} as StudentTestCountRdoModel;

  @observable
  file: any;

  @observable
  fileName: string = '';

  @observable
  studentsByExcel: StudentCdoModel[] = [];

  @observable
  studentsForExcelWrite: StudentListViewModel[] = [];

  @observable
  excelReadCount: ExcelReadCountRdoModel = {} as ExcelReadCountRdoModel;

  @observable
  proposalStateList: string[] = [];

  @observable
  learningStateList: string[] = [];

  @observable
  programLectureUsids: string[] = [];

  @observable
  reportModalOpen: boolean = false;

  // Master 추가 Code
  @observable
  reportFinished: boolean = false;

  @observable
  studentReport: StudentReportUdoModel = {} as StudentReportUdoModel;

  @observable
  mailContents: string = '';

  // Master 추가 Code
  @observable
  studentForGradeSheet: StudentForGradeSheet = {
    studentId: '',
    examId: '',
    studentPatronKeyString: '',
  };
}

Object.defineProperty(StudentService, 'instance', {
  value: new StudentService(),
  writable: false,
  configurable: false,
});
