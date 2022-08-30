import autobind from 'autobind-decorator';
import CubeStudentApi from '../apiclient/CubeStudentApi';
import { action, observable, runInAction } from 'mobx';
import { OffsetElementList } from '@nara.platform/accent/src/snap/index';
import _ from 'lodash';
import { ProposalState } from '../../../../lecture/student/model/ProposalState';
import { LearningState } from '../../../../lecture/student/model/LearningState';
import StudentCount from '../../../../card/student/model/vo/StudentCount';
import { StudentProfileModel } from '../../../../card/student/model/vo/StudentProfileModel';
import StudentApprovalApi from '../../../../student/present/apiclient/StudentApprovalApi';
import StudentApprovalModel from '../../../../card/student/model/StudentApprovalModel';
import { StudentLearningStateUdo } from '../../../../card/student/model/vo/StudentLearningStateUdo';
import { StudentSendEmail } from '../../../../card/student/model/vo/StudentSendEmail';
import StudentByCubeRdo from 'student/model/StudentByCubeRdo';
import { StudentQueryModel } from 'student/model/StudentQueryModel';
import StudentCountRdo from 'student/model/vo/StudentCountRdo';
import { StudentAcceptOrRejectUdo } from '../../../../student/model/vo/StudentAcceptOrRejectUdo';
import { StudentWithUserIdentity } from '../../../../student/model/StudentWithUserIdentity';

@autobind
export default class CubeStudentService {
  //
  static instance: CubeStudentService;

  studentApi: CubeStudentApi;
  studentApprovalApi: StudentApprovalApi;

  @observable
  students: StudentWithUserIdentity[] = [];

  @observable
  student: StudentWithUserIdentity = new StudentWithUserIdentity();

  @observable
  selectedStudents: StudentWithUserIdentity[] = [];

  @observable
  studentQuery: StudentQueryModel = new StudentQueryModel();

  @observable
  resultStudentQuery: StudentQueryModel = new StudentQueryModel();

  @observable
  studentCount: StudentCount = new StudentCount();

  @observable
  studentApproval: StudentApprovalModel = new StudentApprovalModel();

  @observable
  studentsProfile: Map<string, StudentProfileModel> = new Map<string, StudentProfileModel>();

  @observable
  mailContents: string = '';

  // Master 추가 Code

  constructor(cubeStudentApi: CubeStudentApi, studentApprovalApi: StudentApprovalApi) {
    this.studentApi = cubeStudentApi;
    this.studentApprovalApi = studentApprovalApi;
  }

  @action
  async findStudentByCubeRdo(studentByCubeRdo: StudentByCubeRdo): Promise<OffsetElementList<StudentWithUserIdentity>> {
    //
    const targetStudents = await this.studentApi.findCubeStudentByCubeStudentRdo(studentByCubeRdo);

    runInAction(() => {
      this.students = targetStudents.results.map((student) => new StudentWithUserIdentity(student));
    });

    return targetStudents;
  }

  async findStudentByCubeRdoForExcel(
    studentByCubeRdo: StudentByCubeRdo
  ): Promise<OffsetElementList<StudentWithUserIdentity>> {
    //
    return this.studentApi.findCubeStudentByCubeStudentRdoForExcel(studentByCubeRdo);
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
  async deleteByIds(ids: string[]): Promise<void> {
    //
    return this.studentApi.deletedByIds(ids);
  }

  ////////

  @action
  async accept(studentAcceptOrRejectUdo: StudentAcceptOrRejectUdo): Promise<void> {
    //
    return this.studentApi.accept(studentAcceptOrRejectUdo);
  }

  @action
  async reject(studentAcceptOrRejectUdo: StudentAcceptOrRejectUdo): Promise<void> {
    //
    return this.studentApi.reject(studentAcceptOrRejectUdo);
  }

  ////////

  @action
  setSelectedStudents(selectedStudents: StudentWithUserIdentity[]): void {
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
  changeStudentQueryProps(name: string, value: any) {
    //
    if (value === 'All') value = '';
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
    } else if (name === 'phaseCompleteState') {
      let val;
      if (value.checked) {
        val = 'Y';
      } else {
        val = 'N';
      }
      this.studentQuery = _.set(this.studentQuery, name, val);
    } else {
      this.studentQuery = _.set(this.studentQuery, name, value);
    }
  }

  @action
  changeResultStudentQueryProps(name: string, value: any) {
    //
    if (value === 'All') value = '';
    // proposalState + learningState
    if (name === 'studentProposalState') {
      // 학습자 상태 조건 처리
      this.resultStudentQuery = _.set(this.resultStudentQuery, 'applyNotLearningState', '');
      if (['ApprovedAndProgress', 'Approved'].includes(value)) {
        this.resultStudentQuery = _.set(this.resultStudentQuery, 'proposalState', ProposalState.Approved);
        this.resultStudentQuery = _.set(this.resultStudentQuery, 'learningState', LearningState.Progress);
        if (value === 'Approved') {
          // not LearningState
          this.resultStudentQuery = _.set(this.resultStudentQuery, 'applyNotLearningState', 'Y');
        }
      } else {
        this.resultStudentQuery = _.set(this.resultStudentQuery, 'proposalState', value);
        this.resultStudentQuery = _.set(this.resultStudentQuery, 'learningState', null);
      }
    } else if (name === 'phaseCompleteState') {
      let val;
      if (value.checked) {
        val = 'Y';
      } else {
        val = 'N';
      }
      this.resultStudentQuery = _.set(this.resultStudentQuery, name, val);
    } else if (name === 'surveyCompleted') {
      let val = null;
      if (value === 'Y') {
        val = true;
      } else if (value === 'N') {
        val = false;
      }
      this.resultStudentQuery = _.set(this.resultStudentQuery, name, val);
    } else {
      this.resultStudentQuery = _.set(this.resultStudentQuery, name, value);
    }
  }

  @action
  changeStudentApprovalQueryProps(name: string, value: any): void {
    this.studentApproval = _.set(this.studentApproval, name, value);
  }

  @action
  setStudentProfile(map: Map<string, StudentProfileModel>) {
    //
    this.studentsProfile = map;
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
  clearCubeStudents() {
    //
    this.students = [];
  }

  @action
  clearCubeQuery() {
    //
    this.studentQuery = new StudentQueryModel();
  }

  @action
  clearResultStudentQuery() {
    //
    this.resultStudentQuery = new StudentQueryModel();
  }

  @action
  async sendEmail(studentSendEmail: StudentSendEmail): Promise<void> {
    //
    return this.studentApi.sendEmailForAdmin(studentSendEmail);
  }
}

Object.defineProperty(CubeStudentService, 'instance', {
  value: new CubeStudentService(CubeStudentApi.instance, StudentApprovalApi.instance),
  writable: false,
  configurable: false,
});
