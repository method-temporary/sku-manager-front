import { action, observable, runInAction } from 'mobx';
import autobind from 'autobind-decorator';
import _ from 'lodash';

import { PageModel, OffsetElementList } from 'shared/model';

import { MemberModel } from '_data/approval/members/model';

import { BadgeStudentModel } from '../../model/BadgeStudentModel';
import { BadgeStudentCountRdoModel } from '../../model/BadgeStudentCountRdoModel';
import { BadgeExcelReadCountRdoModel } from '../../model/BadgeExcelReadCountRdoModel';
import BadgeStudentApi from '../apiclient/BadgeStudentApi';
import { BadgeIssueState } from '../../model/BadgeIssueState';
import BadgeStudentFlowApi from '../apiclient/BadgeStudentFlowApi';
import { BadgeStudentQueryModel } from '../../model/BadgeStudentQueryModel';
import { BadgeStudentRdoModel } from '../../model/BadgeStudentRdoModel';
import { BadgeMissionMailRequestCdoModel } from '../../model/BadgeMissionMailRequestCdoModel';
import { BadgeMissionStateRequestCdoModel } from '../../model/BadgeMissionStateRequestCdoModel';
import { BadgeIssueStateByEmailUdoModel } from '../../model/BadgeIssueStateByEmailUdoModel';

@autobind
export default class BadgeStudentService {
  //
  static instance: BadgeStudentService;

  studentApi: BadgeStudentApi;
  studentFlowApi: BadgeStudentFlowApi;

  constructor(studentApi: BadgeStudentApi, studentFlowApi: BadgeStudentFlowApi) {
    //
    this.studentApi = studentApi;
    this.studentFlowApi = studentFlowApi;
  }

  @observable
  student: BadgeStudentModel = new BadgeStudentModel();

  @observable
  students: OffsetElementList<BadgeStudentModel> = new OffsetElementList<BadgeStudentModel>();

  @observable
  studentsForModify: BadgeStudentModel[] = [];

  @observable
  studentQuery: BadgeStudentQueryModel = new BadgeStudentQueryModel();

  @observable
  selectedList: string[] = [];

  @observable
  studentCount: BadgeStudentCountRdoModel = {} as BadgeStudentCountRdoModel;

  @observable
  badgeIssueStateUdoByEmail: BadgeIssueStateByEmailUdoModel = new BadgeIssueStateByEmailUdoModel();

  @observable
  studentsExcelWrite: BadgeStudentModel[] = [];

  @observable
  excelReadCount: BadgeExcelReadCountRdoModel = {} as BadgeExcelReadCountRdoModel;

  @observable
  issueStateList: string[] = [];

  @observable
  missionMailModalOpen: boolean = false;

  @action
  async findStudent(studentId: string) {
    //
    const student = await this.studentApi.findStudent(studentId);

    runInAction(() => {
      this.student = new BadgeStudentModel(student);
    });
    return this.student;
  }

  @action
  async findAllStudents(pageModel: PageModel) {
    //
    const students = await this.studentApi.findAllStudents(BadgeStudentQueryModel.asRdo(this.studentQuery, pageModel));

    return runInAction(() => {
      this.students = students;
      this.studentsForModify = students && students.results.map((student) => new BadgeStudentModel(student));
    });
  }

  @action
  async findAllStudentsForExcel(studentRdo?: BadgeStudentRdoModel) {
    //
    const targetStudentRdo = !studentRdo ? BadgeStudentQueryModel.asRdoForExcel(this.studentQuery) : studentRdo;
    const students = await this.studentApi.findAllStudents(targetStudentRdo);
    return runInAction(() => (this.studentsExcelWrite = students.results || null));
  }

  @action
  async findStudentCountByBadgeId(badgeId: string) {
    //
    const studentCount = await this.studentApi.findStudentCount(badgeId);
    return runInAction(() => (this.studentCount = new BadgeStudentCountRdoModel(studentCount) || {}));
  }

  async studentMissionMailRequest(badgeMissionMailRequestCdoModel: BadgeMissionMailRequestCdoModel) {
    //
    return this.studentFlowApi.studentMissionMailRequest(
      badgeMissionMailRequestCdoModel.badgeStudentId,
      badgeMissionMailRequestCdoModel
    );
  }

  async studentMissionRequest(badgeMissionCompletedRequestCdo: BadgeMissionStateRequestCdoModel, passed: boolean) {
    //
    if (passed) {
      //
      await this.studentMissionCompletedRequest(badgeMissionCompletedRequestCdo);
    } else {
      //
      await this.studentMissionFailedRequest(badgeMissionCompletedRequestCdo);
    }
  }

  async studentMissionCompletedRequest(badgeMissionCompletedRequestCdo: BadgeMissionStateRequestCdoModel) {
    //
    return this.studentApi.studentMissionCompletedRequest(badgeMissionCompletedRequestCdo.badgeStudentId);
  }

  async studentMissionFailedRequest(badgeMissionCompletedRequestCdo: BadgeMissionStateRequestCdoModel) {
    //
    return this.studentApi.studentMissionFailedRequest(badgeMissionCompletedRequestCdo.badgeStudentId);
  }

  @action
  changeStudentQueryProps(name: string, value: any) {
    //
    if (value === '전체') value = '';
    if (name === 'issueState') {
      if (value === 'Yes') value = BadgeIssueState.Issued;
    }
    this.studentQuery = _.set(this.studentQuery, name, value);
  }

  @action
  changeStudentsProps(index: number, name: string, value: any) {
    //
    this.studentsForModify = _.set(this.studentsForModify, `[${index}].${name}`, value);
  }

  @action
  changeStudentsExcelProps(index: number, name: string, value: any) {
    //
    this.studentsExcelWrite = _.set(this.studentsExcelWrite, `[${index}].${name}`, value);
  }

  @action
  changeSelectedStudentProps(selectedList: string[]) {
    //
    this.selectedList = selectedList;
  }

  @action
  changeSelectedIssueStateProps(issueStateList: string[]) {
    //
    this.issueStateList = issueStateList;
  }

  @action
  async excelRead(studentsByExcel: BadgeIssueStateByEmailUdoModel) {
    //
    const results = await this.studentFlowApi.excelRead(studentsByExcel);
    runInAction(() => (this.excelReadCount = new BadgeExcelReadCountRdoModel(results) || null));
    return results;
  }

  @action
  setBadgeIssueStateUdoByEmail(udo: BadgeIssueStateByEmailUdoModel) {
    //
    this.badgeIssueStateUdoByEmail = udo;
  }

  issuedBadgeIssueState() {
    //
    return this.studentApi.issuedBadgeIssueState(this.selectedList);
  }

  canceledBadgeIssueState() {
    //
    return this.studentApi.canceledBadgeIssueState(this.selectedList);
  }

  @action
  clearQuery() {
    this.studentQuery = new BadgeStudentQueryModel();
  }

  @action
  changeMissionMailModalOpen(open: boolean) {
    this.missionMailModalOpen = open;
  }

  @action
  changeStudentsRow(student: BadgeStudentModel) {
    const index = this.studentsForModify.findIndex((s) => s.id === student.id);
    if (index > -1) {
      this.studentsForModify = _.set(this.studentsForModify, `[${index}]`, student);
    }
  }

  @action
  async deleteUserBadge() {
    //
    await this.studentApi.deleteUserBadge(this.selectedList);
  }

  @action
  setStudentInfo(studentInfo: MemberModel) {
    //
    return (this.student = _.set(this.student, 'studentInfo', studentInfo));
  }
}

Object.defineProperty(BadgeStudentService, 'instance', {
  value: new BadgeStudentService(BadgeStudentApi.instance, BadgeStudentFlowApi.instance),
  writable: false,
  configurable: false,
});
