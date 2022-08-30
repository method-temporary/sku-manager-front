import { autobind } from '@nara.platform/accent';
import { action, observable, runInAction } from 'mobx';
import _, { join } from 'lodash';

import StudentApi from '../apiclient/StudentApi';
import StudentFlowApi from '../apiclient/StudentFlowApi';
import StudentApprovalApi from '../apiclient/StudentApprovalApi';

import { StudentModel } from '../../model/StudentModel';
import { StudentQueryModel } from '../../model/StudentQueryModel';
import { StudentRequestCdoModel } from '../../model/StudentRequestCdoModel';
import { ProposalState } from '../../model/vo/ProposalState';
import { StudentTestCountRdoModel } from '../../model/StudentTestCountRdoModel';
import { LearningStateUdoModel } from '../../model/vo/LearningStateUdoModel';
import { LearningState } from '../../model/vo/LearningState';
import { StudentReportUdoModel } from '../../model/StudentReportUdoModel';
import { PageModel } from 'shared/model';
import { StudentLearningStateUdo } from '../../../card/student/model/vo/StudentLearningStateUdo';
import StudentApprovalModel from '../../../card/student/model/StudentApprovalModel';
import { StudentProfileModel } from '../../../card/student/model/vo/StudentProfileModel';
import { NameValueList } from 'shared/model';
import { OffsetElementList } from '@nara.platform/accent/src/snap/index';
import StudentCountRdo from 'student/model/vo/StudentCountRdo';
import StudentCount from 'student/model/vo/StudentCount';
import { StudentSendEmail } from '../../../card/student/model/vo/StudentSendEmail';
import StudentByCubeRdo from 'student/model/StudentByCubeRdo';
import { ExcelReadCountRdoModel } from 'student/model/vo/ExcelReadCountRdoModel';
import { StudentByExcelCdo } from '../../model/vo/StudentByExcelCdo';
import { StudentCdo } from '../../model/vo/StudentCdo';
import { StudentWithUserIdentity } from 'student/model/StudentWithUserIdentity';
import StudentEmailCdoModel from 'student/model/StudentEmailCdoModel';
import LectureCardApi from 'lecture/lectureCard/present/apiclient/LectureCardApi';
import StudentDeleteResultModel from 'student/model/StudentDeleteResultModel';

@autobind
class StudentService {
  //
  static instance: StudentService;

  studentApi: StudentApi;
  studentFlowApi: StudentFlowApi;
  studentApprovalApi: StudentApprovalApi;

  @observable
  studentQuery: StudentQueryModel = new StudentQueryModel();

  @observable
  student: StudentModel = {} as StudentModel;

  @observable
  students: StudentWithUserIdentity[] = [];

  @observable
  studentsAll: StudentModel[] = [];

  @observable
  studentsExcel: StudentWithUserIdentity[] = [];

  @observable
  selectedStudents: StudentModel[] = [];

  @observable
  selectedIds: string[] = [];

  @observable
  selectedEmails: string[] = [];

  @observable
  selectedNames: string[] = [];

  @observable
  selectedUserIds: string[] = [];

  @observable
  studentCount: StudentCount = new StudentCount();

  @observable
  studentTestCount: StudentTestCountRdoModel = {} as StudentTestCountRdoModel;

  @observable
  studentApproval: StudentApprovalModel = new StudentApprovalModel();

  @observable
  studentsProfile: Map<string, StudentProfileModel> = new Map<string, StudentProfileModel>();

  @observable
  studentsForModify: StudentModel[] = [];

  @observable
  studentRequest: StudentRequestCdoModel = {} as StudentRequestCdoModel;

  @observable
  studentLearningState: LearningStateUdoModel = {} as LearningStateUdoModel;

  @observable
  studentsExcelWrite: StudentModel[] = [];

  @observable
  proposalStates: string[] = [];

  @observable
  learningStates: string[] = [];

  @observable
  reportModalOpen: boolean = false;

  // Master 추가 Code
  @observable
  reportFinished: boolean = false;

  @observable
  studentsForModal: StudentModel = {} as StudentModel;

  @observable
  studentReport: StudentReportUdoModel = {} as StudentReportUdoModel;

  @observable
  mailContents: string = '';

  @observable
  fileName: string = '';

  @observable
  studentsByExcel: StudentByExcelCdo[] = [];

  @observable
  excelReadCount: ExcelReadCountRdoModel = {} as ExcelReadCountRdoModel;

  @observable
  excelUploadEmailList: string[] = [];

  @observable
  uploadFailedEmailList: string[] = [];

  constructor(studentApi: StudentApi, studentFlowApi: StudentFlowApi, studentApprovalApi: StudentApprovalApi) {
    //
    this.studentApi = studentApi;
    this.studentFlowApi = studentFlowApi;
    this.studentApprovalApi = studentApprovalApi;
  }

  @action
  async findStudent(studentId: string) {
    //
    const student = await this.studentApi.findStudent(studentId);
    return runInAction(() => (this.student = new StudentModel(student)));
  }

  @action
  async modifyStudentForHomework(fileBoxId: string, students: StudentModel[]) {
    //
    if (!fileBoxId) {
      fileBoxId = '';
    }
    return this.studentApi.modifyStudentForHomework(fileBoxId, students);
  }

  @action
  async modifyStudentForHomeworkComment(student: StudentReportUdoModel) {
    //
    return this.studentApi.modifyStudentForHomeworkComment(student);
  }

  @action
  async modifyStudents(examId: string, students: StudentModel[]) {
    //
    return this.studentFlowApi.modifyStudents(examId, students);
  }

  @action
  async findStudentTestCount(rollBookId: string) {
    //
    const studentCount = await this.studentFlowApi.findStudentTestCount(rollBookId);
    return runInAction(() => (this.studentTestCount = new StudentTestCountRdoModel(studentCount) || null));
  }

  async studentRequestOpen(studentRequestCdo: StudentRequestCdoModel) {
    //
    return this.studentFlowApi.studentRequestOpen(studentRequestCdo);
  }

  async studentRequestReject(studentRequestCdo: StudentRequestCdoModel) {
    //
    this.studentFlowApi.studentRequestReject(studentRequestCdo);
  }

  @action
  async removeStudent(studentIds: string[]) {
    //
    await this.studentApi.removeStudent(studentIds);
  }

  @action
  changeStudentQueryProps(name: string, value: any) {
    //
    if (value === '전체') value = '';
    // proposalState + learningState
    if (name === 'studentProposalState') {
      // 학습자 상태 조건 처리
      this.studentQuery = _.set(this.studentQuery, 'applyNotLearningState', '');
      if (['ApprovedAndProgress', 'Approved'].includes(value)) {
        this.studentQuery = _.set(this.studentQuery, 'proposalState', ProposalState.Approved);
        this.studentQuery = _.set(this.studentQuery, 'learningState', LearningState.Progress);
        if (value === 'Approved') {
          // not LearningState
          this.studentQuery = _.set(this.studentQuery, 'applyNotLearningState', 'Y');
        }
      } else {
        this.studentQuery = _.set(this.studentQuery, 'proposalState', value);
        this.studentQuery = _.set(this.studentQuery, 'learningState', null);
      }
    } else if (name === 'surveyCompleted') {
      let val = null;
      if (value === 'Y') {
        val = true;
      } else if (value === 'N') {
        val = false;
      }
      this.studentQuery = _.set(this.studentQuery, name, val);
    } else {
      this.studentQuery = _.set(this.studentQuery, name, value);
    }
  }

  @action
  changeStudentsProp(index: number, name: string, value: any) {
    //
    this.students = _.set(this.students, `[${index}].${name}`, value);
  }

  @action
  changeStudentsAllProp(index: number, name: string, value: any) {
    //
    this.studentsAll = _.set(this.studentsAll, `[${index}].${name}`, value);
  }

  @action
  changeStudentsForModifyProps(index: number, name: string, value: any) {
    //
    this.studentsForModify = _.set(this.studentsForModify, `[${index}].${name}`, value);
  }

  @action
  changeStudentRequestProps(name: string, value: any) {
    //
    this.studentRequest = _.set(this.studentRequest, name, value);
  }

  @action
  changeStudentLearningStateProps(name: string, value: any) {
    //
    this.studentLearningState = _.set(this.studentLearningState, name, value);
  }

  @action
  changeSelectedStudentIds(selectedIds: string[]) {
    //
    this.selectedIds = [...selectedIds];
  }

  @action
  changeSelectedStudents(selectedStudents: StudentModel[]) {
    //
    this.selectedStudents = [...selectedStudents];
  }

  @action
  changeSelectedStudentEmails(selectedEmails: string[]) {
    //
    this.selectedEmails = [...selectedEmails];
  }

  // Master 추가 Code
  @action
  changeSelectedStudentNames(selectedNames: string[]) {
    //
    this.selectedNames = [...selectedNames];
  }

  @action
  changeSelectedStudentUserIds(selectedUserIds: string[]) {
    //
    this.selectedUserIds = [...selectedUserIds];
  }

  @action
  changeSelectedProposalStates(proposals: string[]) {
    //
    this.proposalStates = [...proposals];
  }

  @action
  changeSelectedLearningStates(learningStates: string[]) {
    //
    this.learningStates = [...learningStates];
  }

  async modifyLearningState(learningStateUdo: LearningStateUdoModel) {
    //
    return this.studentFlowApi.modifyLearningState(learningStateUdo);
  }

  @action
  clearQuery() {
    this.studentQuery = new StudentQueryModel();
  }

  @action
  changeReportModalOpen(open: boolean) {
    //
    this.reportModalOpen = open;
  }

  @action
  reportModalShow(student: StudentModel) {
    //
    this.changeReportModalOpen(true);
    this.studentsForModal = student;
  }

  @action
  changeStudentReportProps(name: string, value: string) {
    //
    // Master 수정 Code -> adv : _.set(this.student)
    this.studentReport = _.set(this.studentReport, name, value);
  }

  // 2021-03-29 박종유 Card Function 추가
  @action
  async findCardStudents(pageModel: PageModel, type?: string): Promise<number> {
    //
    const students = await this.studentApi.findCardStudentsById(
      StudentQueryModel.asStudentCardRdo(this.studentQuery, pageModel, { type })
    );

    runInAction(() => {
      this.students = students.results.map((student) => new StudentWithUserIdentity(student));
    });

    return students.totalCount;
  }

  @action
  async findAllCardStudentsPDF(): Promise<number> {
    //
    const students = await this.studentApi.findCardStudentsByIdForExcel(
      StudentQueryModel.asStudentCardRdo(this.studentQuery, new PageModel(0, 99999999))
    );

    runInAction(() => {
      this.students = students.results.map((student) => new StudentWithUserIdentity(student));
    });

    return students.totalCount;
  }

  @action
  async findAllCardStudents() {
    //
    const students = await this.studentApi.findCardStudentsByIdForExcel(
      StudentQueryModel.asStudentCardRdo(this.studentQuery, new PageModel(0, 99999999))
    );

    runInAction(() => {
      this.studentsExcel = students.results.map((student) => new StudentWithUserIdentity(student));
    });

    return this.studentsExcel;
  }

  @action
  async findStudentCount(cardId: string) {
    //
    const studentCount = await this.studentApi.findStudentCount(
      StudentQueryModel.asStudentCardRdo(this.studentQuery, new PageModel(0, 99999999), { cardId })
    );

    runInAction(() => {
      this.studentCount = new StudentCount(studentCount);
    });
  }

  @action
  async modifyStudentsLearningState(ids: string[], state: LearningState) {
    //
    await this.studentApi.modifyStudentsState(StudentLearningStateUdo.fromStudentInfo(ids, state));
  }

  // 2021-04-01 박종유 Cube Student Approval 추가
  @action
  async accept(ids: string[]): Promise<void> {
    //
    return this.studentApprovalApi.accept(ids);
  }

  @action
  async reject(ids: string[], nameValues: NameValueList): Promise<void> {
    //
    return this.studentApprovalApi.reject(ids, nameValues);
  }

  @action
  setStudentProfile(map: Map<string, StudentProfileModel>) {
    //
    this.studentsProfile = map;
  }

  @action
  async findStudentByCubeRdo(studentByCubeRdo: StudentByCubeRdo): Promise<OffsetElementList<StudentWithUserIdentity>> {
    //
    const targetStudents = await this.studentApi.findStudentByCubeRdo(studentByCubeRdo);

    runInAction(() => {
      this.students = targetStudents.results.map((student) => new StudentWithUserIdentity(student));
    });

    return targetStudents;
  }

  @action
  async countStudent(studentCountRdo: StudentCountRdo): Promise<StudentCount> {
    //
    const studentCount = await this.studentApi.countStudent(studentCountRdo);
    runInAction(() => {
      this.studentCount = new StudentCount(studentCount);
    });

    return studentCount;
  }

  @action
  async modifyStudentLearningState(studentLearningStateUdo: StudentLearningStateUdo): Promise<void> {
    //
    return this.studentApi.modifyStudentLearningState(studentLearningStateUdo);
  }

  @action
  setSelectedStudents(selectedStudents: StudentModel[]): void {
    //
    this.selectedStudents = [...selectedStudents];
  }

  @action
  clearSelectedStudents(): void {
    //
    this.selectedStudents = [];
  }

  @action
  onChangeTargetStudentProp(index: number, name: string, value: boolean) {
    this.students = _.set(this.students, `[${index}].${name}`, value);
  }

  @action
  changeStudentApprovalQueryProps(name: string, value: any): void {
    this.studentApproval = _.set(this.studentApproval, name, value);
  }

  @action
  setMailContents(mailContents: string) {
    //
    this.mailContents = mailContents;
  }

  @action
  clearMainContents() {
    //
    this.mailContents = '';
  }

  @action
  clearSelected() {
    //
    this.selectedEmails = [];
    this.selectedIds = [];
    this.selectedNames = [];
    this.selectedUserIds = [];
    this.selectedStudents = [];
  }

  @action
  async sendEmail(studentSendEmail: StudentSendEmail): Promise<void> {
    //
    return this.studentApi.sendEmailForAdmin(studentSendEmail);
  }

  @action
  setUploadedFileName(fileName: string) {
    //
    this.fileName = fileName;
  }

  @action
  setStudentsByExcel(studentCdo: StudentCdo, students: StudentModel[]) {
    //
    const newStudents: StudentByExcelCdo[] = [];
    students.forEach((student) => {
      newStudents.push(new StudentByExcelCdo({ studentCdo, email: student.email }));
    });
    this.studentsByExcel = newStudents;
  }

  @action
  async excelRead(studentsByExcel: StudentByExcelCdo[]): Promise<ExcelReadCountRdoModel> {
    //
    const results = await this.studentApi.uploadByExcel(studentsByExcel);
    runInAction(() => (this.excelReadCount = new ExcelReadCountRdoModel(results) || null));
    return results;
  }

  @action
  clearExcelUpload() {
    this.excelUploadEmailList = [];
    this.uploadFailedEmailList = [];
  }

  @action
  async excelUpload(emailList: string[]) {
    runInAction(() => {
      this.excelUploadEmailList = [...emailList];
    });
  }

  @action
  async registerCardStudents(cardId: string) {
    //

    /* eslint-disable no-await-in-loop */
    for (let i = 0; i < this.excelUploadEmailList.length; i++) {
      //
      const email = this.excelUploadEmailList[i];
      const result = await this.studentApi.registerStudentByEmail(new StudentEmailCdoModel({ cardId, email }));

      !result &&
        runInAction(() => {
          this.uploadFailedEmailList = [...this.uploadFailedEmailList, email];
        });
    }

    return this.uploadFailedEmailList;
  }

  @action
  async removeStudentInCard(studentIds: string[]): Promise<StudentDeleteResultModel[]> {
    //
    const result = await this.studentApi.deleteCardStudent(studentIds);

    const addNameResult: StudentDeleteResultModel[] = [];

    runInAction(
      () =>
        result &&
        result.length > 0 &&
        result
          .filter((joinedCube) => !joinedCube.removed)
          .map((joinedCube) => {
            const student =
              this.students &&
              this.students.length > 0 &&
              this.students.find((student) => student.student.id === joinedCube.id)?.student;
            student && addNameResult.push(StudentDeleteResultModel.addNameModel(joinedCube, student.name));
          })
    );

    return addNameResult;
  }
}

StudentService.instance = new StudentService(StudentApi.instance, StudentFlowApi.instance, StudentApprovalApi.instance);
export default StudentService;
