import * as React from 'react';
import { Button, Grid, Select } from 'semantic-ui-react';
import { RouteComponentProps, withRouter } from 'react-router';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import XLSX from 'xlsx';

import { MemberViewModel } from '@nara.drama/approval';
import { reactAlert, reactAutobind, ReactComponent } from '@nara.platform/accent';

import { PageModel, SelectType, CubeType } from 'shared/model';
import { SharedService, SendSmsService } from 'shared/present';
import {
  alert,
  AlertModel,
  confirm,
  ConfirmModel,
  Pagination,
  SubActions,
  Loader,
  SendEmailModal,
  SendSmsModal,
} from 'shared/components';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { UserService } from 'user';
import { CubeStudentService } from 'cube/cube';
import { ClassroomModel } from 'cube/classroom';
import { ClassroomGroupService, CubeService } from 'cube';
import ManagerListModal from 'cube/cube/ui/view/ManagerListModal';
import { CardService } from 'card';
import { StudentCountType } from 'card/student/model/vo/StudentCountType';
import CardByCubeModal from 'card/card/ui/logic/CardByCubeModal';
import { StudentSendEmail } from 'card/student/model/vo/StudentSendEmail';
import { StudentLearningStateUdo } from 'card/student/model/vo/StudentLearningStateUdo';
import { StudentService } from 'student';
import { StudentModel } from 'student/model/StudentModel';
import { ProposalState } from 'student/model/vo/ProposalState';
import { StudentQueryModel } from 'student/model/StudentQueryModel';
import { StudentCdo } from 'student/model/vo/StudentCdo';
import { StudentByExcelCdo } from 'student/model/vo/StudentByExcelCdo';
import { StudentAcceptOrRejectUdo } from 'student/model/vo/StudentAcceptOrRejectUdo';
import { StudentWithUserIdentity } from 'student/model/StudentWithUserIdentity';
import { MemberService } from 'approval';

import { LectureService, RollBookService } from '../../../index';

import StudentInformationSearchBox from '../view/StudentInformationSearchBox';
import StudentInformationListView from '../view/StudentInformationListView';
import CompanionModal from './CompanionModal';
import RejectionReasonModal from './RejectionReasonModal';
import { LearningState } from '../../model/LearningState';
import { StudentXlsxModel } from '../../model/StudentXlsxModel';
import ExcelReadModal from './ExcelReadModal';
import CubeStudentExcelUploadFailureListModal from './CubeStudentExcelUploadFailureListModal';

interface Props extends RouteComponentProps<Params> {}

interface Params {
  cubeId: string;
}

interface States {
  companionModalWin: boolean;
  rejectionReasonModalWin: boolean;
  rejectionMessage: string;
  fileName: string;
  excelReadModalWin: boolean;
  excelConfirmWin: boolean;
  alertMessage: string;
  alertTitle: string;
  alertIcon: string;
  alertType: string;
  rollBookId: string;
  loaderText: string;
  failedModalOpen: boolean;
  failedList: string[];
  modalText: string;
}

interface Injected {
  cubeService: CubeService;
  sharedService: SharedService;
  cubeStudentService: CubeStudentService;
  studentService: StudentService;
  lectureService: LectureService;
  rollBookService: RollBookService;
  classroomGroupService: ClassroomGroupService;
  userService: UserService;
  memberService: MemberService;
  cardService: CardService;
  sendSmsService: SendSmsService;
}

@inject(
  'sharedService',
  'cubeStudentService',
  'studentService',
  'lectureService',
  'rollBookService',
  'cubeService',
  'classroomGroupService',
  'userService',
  'memberService',
  'cardService',
  'sendSmsService'
)
@observer
@reactAutobind
class CubeStudentInformationContainer extends ReactComponent<Props, States, Injected> {
  //
  paginationKey = 'cube-student-information';

  constructor(props: Props) {
    super(props);
    this.state = {
      companionModalWin: false,
      rejectionReasonModalWin: false,
      rejectionMessage: '',
      fileName: '',
      excelReadModalWin: false,
      excelConfirmWin: false,
      alertMessage: '',
      alertTitle: '',
      alertIcon: '',
      alertType: '',
      rollBookId: '',
      loaderText: '',
      failedModalOpen: false,
      failedList: [],
      modalText: '',
    };

    this.injected.cubeStudentService.clearCubeQuery();
  }

  componentDidMount() {
    //
    this.injected.cubeStudentService.clearSelectedStudents();
    this.injected.cardService.clearSelectedCardByCube();
    this.injected.studentService.clearSelected();

    const { userService, sendSmsService } = this.injected;
    userService.findUser(); // ????????? ????????? ?????????
    // ?????? ??????
    sendSmsService.findMySmsSenderAllowed();
  }

  setClassroom(round: number): void {
    const { cubeService, classroomGroupService } = this.injected;
    if (cubeService.cubeDetail.cubeMaterial.classrooms) {
      const classroom = cubeService.cubeDetail.cubeMaterial.classrooms.find((target) => target.round === round);
      classroomGroupService.setCubeClassroom(classroom || new ClassroomModel());
    } else {
      classroomGroupService.setCubeClassroom(new ClassroomModel());
    }
  }

  async findStudentsBySearch() {
    //
    const { cubeStudentService, classroomGroupService, sharedService } = this.injected;
    const { studentQuery } = cubeStudentService;
    const { cubeId } = this.props.match.params;
    const pageModel = sharedService.getPageModel(this.paginationKey);

    // const round = classroomGroupService.cubeClassroom.round || 1;
    // cubeStudentService.changeStudentQueryProps('round', round);

    cubeStudentService.clearSelectedStudents();
    const offsetElementList = await cubeStudentService.findStudentByCubeRdo(
      StudentQueryModel.asStudentByCubeRdo(studentQuery, cubeId, pageModel)
    );
    // await this.setStudentInfo(cubeStudentService.students);

    sharedService.setCount(this.paginationKey, offsetElementList.totalCount);

    // cubeStudentService.changeStudentQueryProps('studentCountType', StudentCountType.APPROVAL);

    await cubeStudentService.countStudent(
      StudentQueryModel.asStudentTestCountRdo(cubeStudentService.studentQuery, cubeId, StudentCountType.PROPOSAL_STATE)
    );
  }

  // async setStudentInfo(students: StudentModel[]) {
  //   //
  //   const { cubeStudentService, memberService } = this.injected;
  //   const { setStudentProfile } = cubeStudentService;
  //
  //   const ids: string[] = students.map((student) => student.patronKey.keyString);
  //
  //   const members = await memberService.findMemberByIds(ids);
  //
  //   const map: Map<string, StudentProfileModel> = new Map<string, StudentProfileModel>();
  //
  //   await members.forEach((member) => {
  //     map.set(
  //       member.patronKey.keyString,
  //       new StudentProfileModel({
  //         id: member.patronKey.keyString,
  //         company: member.companyName,
  //         department: member.departmentName,
  //         email: member.email,
  //       })
  //     );
  //   });
  //
  //   setStudentProfile(map);
  // }

  onChangeStudentQueryProps(name: string, value: any) {
    //
    const { cubeStudentService } = this.injected;
    cubeStudentService.changeStudentQueryProps(name, value);
  }

  checkAll(isChecked: boolean) {
    //
    const { cubeStudentService, studentService } = this.injected;
    const { changeSelectedStudentEmails, changeSelectedStudentNames, changeSelectedStudentIds, studentsProfile } =
      studentService;
    const { students } = cubeStudentService;

    if (isChecked) {
      cubeStudentService.setSelectedStudents(students);
      /* email ?????? ??????.
      changeSelectedStudentEmails(students.map((target) => {
                                    const profile = studentsProfile.get(target.student.patronKey.keyString);
                                    return (profile && profile.email) || '';}));*/
      changeSelectedStudentEmails(students.map((target) => target.userIdentity.email));
      changeSelectedStudentNames(students.map((target) => target.student.name));
      changeSelectedStudentIds(students.map((target) => target.student.id));
    } else {
      cubeStudentService.setSelectedStudents([]);
      changeSelectedStudentEmails([]);
      changeSelectedStudentNames([]);
      changeSelectedStudentIds([]);
    }
  }

  checkOne(index: number, student: StudentWithUserIdentity, value: any): void {
    //
    const { cubeStudentService } = this.injected;
    const { selectedStudents, studentsProfile } = cubeStudentService;
    const {
      changeSelectedStudentEmails,
      changeSelectedStudentNames,
      changeSelectedStudentUserIds,
      changeSelectedStudentIds,
    } = this.injected.studentService;
    const targetList = [...selectedStudents];

    if (targetList.map((target) => target.student.id).includes(student.student.id)) {
      targetList.splice(targetList.map((target) => target.student.id).indexOf(student.student.id), 1);
    } else {
      targetList.push(student);
    }

    cubeStudentService.setSelectedStudents(targetList);
    /* email ?????? ??????. changeSelectedStudentEmails(targetList.map((target) => {
                                    const profile = studentsProfile.get(target.student.patronKey.keyString);
                                    return (profile && profile.email) || '';}));*/
    changeSelectedStudentEmails(targetList.map((target) => target.userIdentity.email));
    changeSelectedStudentNames(targetList.map((target) => target.student.name));
    changeSelectedStudentUserIds(targetList.map((target) => target.userIdentity.id));
    changeSelectedStudentIds(targetList.map((target) => target.student.id));
  }

  handleRejectReasonWin(e: any, message: string) {
    //
    e.preventDefault();
    this.setState({
      rejectionReasonModalWin: true,
      rejectionMessage: message,
    });
  }

  onChangeStudentApprovalProps(e: any, message: string): void {
    //
    const { cubeStudentService } = this.injected;
    cubeStudentService.changeStudentApprovalQueryProps('remark', message);
  }

  async changeRound(name: string, value: any) {
    //
    const { cubeStudentService } = this.injected;
    cubeStudentService.changeStudentQueryProps(name, value);
    // this.setClassroom(value);

    await this.findStudentsBySearch();
  }

  countRound(): any[] {
    //
    const { classroomGroupService } = this.injected;
    const { cubeClassrooms } = classroomGroupService;
    const roundList: any = [{ key: '??????', text: `??????`, value: null }];

    if (cubeClassrooms.length > 0 && cubeClassrooms[0].id !== '') {
      cubeClassrooms.forEach((classroom) => {
        roundList.push({ key: classroom.round, text: `${classroom.round}??????`, value: classroom.round });
      });
    } else {
      roundList.push({ key: 1, text: `1??????`, value: 1 });
    }

    return roundList;
  }

  handleYearMonthDateHourMinuteSecond(today: Date, classroom: any, sted: string) {
    if (classroom && classroom.enrolling && classroom.enrolling.learningPeriod) {
      if (sted === 'start') {
        const stDate = new Date(classroom!.enrolling.learningPeriod.startDate);
        return {
          year: stDate.getFullYear(),
          month: stDate.getMonth(),
          date: stDate.getDate(),
        };
      } else {
        const edDate = new Date(classroom!.enrolling.learningPeriod.endDate);
        return {
          year: edDate.getFullYear(),
          month: edDate.getMonth(),
          date: edDate.getDate(),
        };
      }
    } else {
      return {
        year: today.getFullYear(),
        month: today.getMonth(),
        date: today.getDate(),
      };
    }
  }

  changeLearningStateProgress() {
    //
    const { cubeStudentService } = this.injected;
    const { selectedStudents } = cubeStudentService;

    if (selectedStudents.length < 0) {
      alert(AlertModel.getCustomAlert(false, '??????', '???????????? ???????????????.', '??????', () => {}));
      return;
    }

    alert(
      AlertModel.getCustomAlert(
        false,
        '??????',
        '?????????????????? ?????? ???????????????????<br />???????????? ????????? ??? ?????? ??? ???????????? ?????????????????? ?????? ?????????.',
        '??????',
        () => {
          this.modifyLearningState(
            selectedStudents.map((student) => student.student.id),
            LearningState.Progress
          );
        }
      )
    );
  }

  async modifyLearningState(selectedList: string[], learningState: LearningState) {
    const { cubeStudentService } = this.injected;

    await cubeStudentService.modifyStudentLearningState(
      StudentLearningStateUdo.fromStudentInfo(selectedList, learningState)
    );
    cubeStudentService.clearSelectedStudents();
    await this.findStudentsBySearch();
  }

  async acceptStudents(): Promise<void> {
    //
    const { cubeStudentService, classroomGroupService } = this.injected;
    const { selectedStudents, studentCount } = cubeStudentService;
    const { cubeClassroom } = classroomGroupService;

    const selectedStudentIds = selectedStudents.map((student) => student.student.id);
    const proposalStateList = selectedStudents.filter(
      (student) => student.student.proposalState === ProposalState.Approved
    );
    const capacity = cubeClassroom.capacity;
    const approvedStudentsCount = studentCount.proposalStateCount.approvedCount;

    if (selectedStudentIds.length < 1) {
      //
      alert(AlertModel.getCustomAlert(false, '??????', '???????????? ???????????????', '??????', () => {}));
      return;
    }

    if (proposalStateList.length > 0) {
      alert(AlertModel.getCustomAlert(false, '??????', '?????? ????????? ???????????? ?????????????????????.', '??????', () => {}));
      return;
    }

    if (capacity < approvedStudentsCount + selectedStudents.length) {
      alert(
        AlertModel.getCustomAlert(
          true,
          '??????',
          `????????? ????????????????????? ??????(${capacity} ???)/??????(${selectedStudents.length}???)/??????(${
            approvedStudentsCount + selectedStudents.length - capacity
          }???)`,
          '??????',
          () => {}
        )
      );
      return;
    }

    confirm(
      ConfirmModel.getCustomConfirm(
        '?????? ?????? ??????',
        '???????????? ???????????? ?????? ???????????????????',
        false,
        '??????',
        '??????',
        () => {
          this.acceptStudent();
        }
      ),
      false
    );
  }

  async acceptStudent(): Promise<void> {
    const { cubeStudentService } = this.injected;
    const { selectedStudents } = cubeStudentService;

    const selectedStudentIds = selectedStudents.map((student) => student.student.id);

    await cubeStudentService
      .accept(
        new StudentAcceptOrRejectUdo({
          studentIds: selectedStudentIds,
          remark: cubeStudentService.studentApproval.remark,
        })
      )
      .then(() => {
        alert(AlertModel.getCustomAlert(false, '?????? ??????', '???????????? ???????????? ?????? ???????????????.', '??????', () => {}));
      });

    await this.findStudentsBySearch();
  }

  onOpenCompanion() {
    //
    const { cubeStudentService } = this.injected;
    const { selectedStudents } = cubeStudentService;

    const selectedStudentIds = selectedStudents.map((student) => student.student.id);
    const rejectedStateList = selectedStudents.filter(
      (student) => student.student.proposalState === ProposalState.Rejected
    );

    if (selectedStudentIds.length < 1) {
      //
      alert(AlertModel.getCustomAlert(false, '??????', '???????????? ???????????????', '??????', () => {}));
      return;
    }

    if (rejectedStateList.length > 0) {
      alert(AlertModel.getCustomAlert(false, '??????', '?????? ????????? ???????????? ?????????????????????.', '??????', () => {}));
      return;
    }

    this.setState({
      companionModalWin: true,
    });
  }

  async handleCloseCompanion() {
    //
    this.setState({
      companionModalWin: false,
    });
    await this.findStudentsBySearch();
  }

  async rejectStudents() {
    //
    confirm(
      ConfirmModel.getCustomConfirm(
        '?????? ?????? ??????',
        '???????????? ???????????? ?????? ???????????????????',
        false,
        '??????',
        '??????',
        () => {
          this.rejectStudent();
        }
      ),
      false
    );

    this.setState({
      companionModalWin: false,
    });
  }

  async rejectStudent() {
    const { cubeStudentService } = this.injected;
    const { selectedStudents } = cubeStudentService;

    const selectedStudentIds = selectedStudents.map((student) => student.student.id);
    await cubeStudentService
      .reject(
        new StudentAcceptOrRejectUdo({
          studentIds: selectedStudentIds,
          remark: cubeStudentService.studentApproval.remark,
        })
      )
      .then(() => {
        alert(AlertModel.getCustomAlert(false, '?????? ??????', '???????????? ???????????? ?????? ???????????????.', '??????', () => {}));
      });
    await this.findStudentsBySearch();
  }

  checkEmail(): boolean {
    // const { cubeStudentService } = this.injected;
    // const { selectedStudents } = cubeStudentService;

    // if (selectedStudents.length <= 0) {
    //   reactAlert({
    //     title: '??????',
    //     message: '???????????? ???????????????.',
    //     onClose: () => {},
    //     warning: false,
    //   });
    //   return false;
    // } else {
    //   return true;
    // }
    const { count } = this.injected.sharedService.getPageModel(this.paginationKey);
    if (count <= 0) {
      reactAlert({
        title: '??????',
        message: '???????????? ????????????.',
        onClose: () => {},
        warning: false,
      });
      return false;
    }
    return true;
  }

  checkSms(): boolean {
    const { count } = this.injected.sharedService.getPageModel(this.paginationKey);
    if (count <= 0) {
      reactAlert({
        title: '??????',
        message: '???????????? ????????????.',
        onClose: () => {},
        warning: false,
      });
      return false;
    }

    const { sendSmsService } = this.injected;
    const { allowed } = sendSmsService;
    if (allowed) {
      return true;
    } else {
      reactAlert({
        title: '??????',
        message: 'SMS ?????? ????????? ???????????? Help Desk(02-6323-9002)??? ?????? ????????? ????????????',
        onClose: () => {},
        warning: false,
      });
      return false;
    }
  }

  async sendEmail() {
    const { cubeStudentService } = this.injected;
    const { selectedStudents, studentsProfile } = cubeStudentService;

    const studentSendEmail = new StudentSendEmail();

    studentSendEmail.emails = selectedStudents.map((student) => {
      let email = '';
      if (studentsProfile.get(student.student.patronKey.keyString)) {
        email = studentsProfile.get(student.student.patronKey.keyString)!.email;
      }
      return email;
    }); // ?????? ?????? ??????
    studentSendEmail.mailContents = cubeStudentService.mailContents; // ?????? ??????

    await cubeStudentService.sendEmail(studentSendEmail).then(() => {
      reactAlert({ title: '??????', message: '?????????????????????.' });
      this.findStudentsBySearch();
    });
  }

  onChangeStudentRequestProps(name: string, value: string) {
    const { cubeStudentService } = this.injected;
    cubeStudentService.setMailContents(value);
  }

  async handleDelete() {
    //
    const { cubeStudentService } = this.injected;
    const { selectedStudents } = cubeStudentService;

    const selectedStudentIds = selectedStudents.map((student) => student.student.id);

    confirm(
      ConfirmModel.getRemoveConfirm(() => {
        cubeStudentService
          .deleteByIds(selectedStudentIds)
          .then(() => {
            this.findStudentsBySearch();
            alert(AlertModel.getRemoveSuccessAlert());
          })
          .catch(() => {
            this.findStudentsBySearch();
            alert(AlertModel.getCustomAlert(true, '??????', '?????? ??????', '??????', () => {}));
          });
      }),
      false
    );
  }

  async onDownloadExcel() {
    //
    const { cubeStudentService, memberService, cubeService } = this.injected;
    const { studentQuery, studentsProfile } = cubeStudentService;
    const { cubeDetail } = cubeService;
    const { cubeId } = this.props.match.params;

    const studentsForExcel = await cubeStudentService.findStudentByCubeRdoForExcel(
      StudentQueryModel.asStudentByCubeRdo({ ...studentQuery, round: undefined }, cubeId, new PageModel(0, 99999))
    );

    const wbList: StudentXlsxModel[] = [];
    studentsForExcel.results.forEach((student) => {
      wbList.push(StudentModel.asCubeStudentXLSX(new StudentWithUserIdentity(student), studentsProfile));
    });
    const studentExcel = XLSX.utils.json_to_sheet(wbList);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, studentExcel, 'Students');

    // const worksheet: WorkSheet = wb.Sheets;

    const date = moment().format('YYYY-MM-DD_HH:mm:ss');
    const time = new Date().toLocaleTimeString('en-GB');
    const fileName = `${getPolyglotToAnyString(cubeDetail.cube.name)}.${date}:${time}.xlsx`;
    XLSX.writeFile(wb, fileName, { compression: true });
    return fileName;
  }

  handleCloseRejectionReason() {
    //
    this.setState({
      rejectionReasonModalWin: false,
    });
  }

  async findRollBookId(round: number): Promise<string> {
    const { rollBookService, cardService } = this.injected;
    const { selectedCardByCube } = cardService;
    const rollBook = await rollBookService.findRollBookByLectureCardIdAndRound(selectedCardByCube.card.id, round);
    return rollBook.id;
  }

  handleManagerModalOk(member: MemberViewModel, memberList: MemberViewModel[]) {
    const { studentService, cardService, cubeService, classroomGroupService } = this.injected;
    const studentCdos: StudentByExcelCdo[] = [];
    const round = 1;
    const cubeId = cubeService.cubeDetail.cube.id;
    const cardId = cardService.selectedCardByCube.card.id;

    Promise.resolve()
      .then(() =>
        memberList.forEach((member) => {
          const studentCdo = new StudentCdo({ cardId, cubeId, round, approverDenizenId: '' });
          const studentByExcelCdo = new StudentByExcelCdo({ studentCdo, email: member.email });
          studentCdos.push(studentByExcelCdo);
        })
      )
      .then(() => studentService!.excelRead(studentCdos))
      .then((excelReadCountRdoModel) => {
        this.setState({
          excelReadModalWin: false,
        });
        alert(
          AlertModel.getCustomAlert(
            false,
            '??????',
            `??? ${excelReadCountRdoModel.requestCount}???  ???,  ${excelReadCountRdoModel.successCount}?????? ?????????????????????.`,
            '??????',
            () => {}
          )
        );
      })
      .then(() => {
        this.findStudentsBySearch();
      });
  }

  onChangeOpen() {
    //
    const { excelReadModalWin } = this.state;
    if (excelReadModalWin) this.setState({ excelReadModalWin: false });
    else this.setState({ excelReadModalWin: true });
  }

  uploadFile(file: File) {
    //
    const { studentService, userService, classroomGroupService, cubeService, cardService } = this.injected;
    // const { member } = userService!.skProfile;
    const round = 1;
    const cubeId = cubeService.cubeDetail.cube.id;
    const cardId = cardService.selectedCardByCube.card.id;

    const studentCdo = new StudentCdo({ cardId, cubeId, round, approverDenizenId: '' });

    if (studentService) {
      studentService.setUploadedFileName(file.name);
      this.setState({ fileName: file.name });
      const fileReader = new FileReader();
      fileReader.onload = (e: any) => {
        let binary = '';
        const data = new Uint8Array(e.target.result);
        const length = data.byteLength;
        for (let i = 0; i < length; i++) {
          binary += String.fromCharCode(data[i]);
        }
        const workbook: any = XLSX.read(binary, { type: 'binary' });
        let students: StudentModel[] = [];

        workbook.SheetNames.forEach((item: any) => {
          const jsonArray = XLSX.utils.sheet_to_json<StudentModel>(workbook.Sheets[item]);
          if (jsonArray.length === 0) {
            return;
          }
          students = jsonArray;
        });
        if (userService) {
          const today = new Date();
          this.setSkProfileQueryProp('email', students[0].email);
          this.setSkProfileQueryProp('startDate', new Date(today.getTime() - 3000 * 24 * 60 * 60 * 1000));
          this.setSkProfileQueryProp('endDate', today);
          this.setSkProfileQueryProp('signed', 'true');
          userService.findAllUserBySearchKey();
          // const { skProfiles } = this.props.userService || {} as userService;
        }
        studentService.setStudentsByExcel(studentCdo, students);
      };
      fileReader.readAsArrayBuffer(file);
    }
  }

  setSkProfileQueryProp(name: string, value: string | Date, nameSub?: string) {
    //
    const { userService } = this.injected;
    if (userService) {
      userService.onChangeUserQueryProp(name, value);
    }
  }

  async onReadExcel(): Promise<void> {
    //
    const { studentService } = this.injected;
    const { studentsByExcel } = this.injected.studentService;

    let loadingCount = 0;
    let successCount = 0;
    const fails: string[] = [];
    const SPLIT_COUNT = 50;
    let separationStudents: StudentByExcelCdo[] = [];

    /* eslint-disable no-await-in-loop */
    for (let i = 0; i < studentsByExcel.length; i += SPLIT_COUNT) {
      this.setState({
        loaderText: `?????? ????????? ???(${loadingCount}/${studentsByExcel.length})`,
      });
      separationStudents = studentsByExcel.slice(i, i + SPLIT_COUNT);
      await studentService.excelRead(separationStudents).then((excelReadCountRdoModel) => {
        successCount += excelReadCountRdoModel.successCount;
        fails.push(...excelReadCountRdoModel.failed);
        loadingCount += SPLIT_COUNT;
      });
    }
    this.setState({
      excelReadModalWin: false,
    });
    this.setState({
      failedModalOpen: true,
      modalText: `??? ${studentsByExcel.length}??? ??? ${successCount}?????? ??????, ${fails.length}?????? ???????????? ???????????????.`,
      failedList: fails,
    });
  }

  async onFailedModalClosed() {
    this.setState({ failedModalOpen: false });
    await this.findStudentsBySearch();
  }

  render() {
    //
    const {
      companionModalWin,
      rejectionReasonModalWin,
      rejectionMessage,
      fileName,
      excelReadModalWin,
      loaderText,
      failedModalOpen,
      failedList,
      modalText,
    } = this.state;
    const { cubeService, cardService, cubeStudentService, classroomGroupService, sharedService, studentService } =
      this.injected;
    const { cubeId } = this.props.match.params;
    const { students, selectedStudents, studentQuery, studentCount, studentsProfile } = cubeStudentService;
    const { selectedEmails, selectedNames, selectedIds } = studentService;
    const { selectedCardByCube } = cardService;
    const { cubeClassroom } = classroomGroupService;
    const { startNo, count } = sharedService.getPageModel(this.paginationKey);
    const cubeType = cubeService.cubeDetail.cube.type;
    const cubeName = cubeService.cubeDetail.cube.name;

    const today = new Date();
    const {
      year: startYear,
      month: startMonth,
      date: startDate,
    } = this.handleYearMonthDateHourMinuteSecond(today, cubeClassroom, 'start');
    const {
      year: endYear,
      month: endMonth,
      date: endDate,
    } = this.handleYearMonthDateHourMinuteSecond(today, cubeClassroom, 'end');

    const isEnrollment = ((cubeType === 'ClassRoomLecture' || cubeType === 'ELearning') && true) || false;

    return (
      <>
        <StudentInformationSearchBox
          onSearchPostsBySearchBox={this.findStudentsBySearch}
          onChangeStudentQueryProps={this.onChangeStudentQueryProps}
          paginationKey={this.paginationKey}
          studentQuery={studentQuery}
        />
        <Pagination name={this.paginationKey} onChange={this.findStudentsBySearch}>
          <Grid className="list-info">
            <Grid.Row>
              <Grid.Column width={8}>
                <Select
                  className="ui small-border dropdown m0"
                  // value={studentQuery.round}
                  // control={Select}
                  options={this.countRound()}
                  placeholder="??????"
                  onChange={(e: any, data: any) => this.changeRound('round', data.value)}
                />
                {studentCount && (
                  <span>
                    ?????? <strong>{studentCount.totalStudentCount}</strong>??? <span className="dash">|</span>
                    ?????? ?????? <strong>{studentCount.proposalStateCount.submittedCount}</strong>???{' '}
                    <span className="dash">|</span>
                    ?????? <strong>{studentCount.proposalStateCount.approvedCount}</strong>???{' '}
                    <span className="dash">|</span>
                    ?????? <strong>{studentCount.proposalStateCount.rejectedCount}</strong>???{' '}
                    <span className="dash">|</span>
                    ?????? <strong>{studentCount.proposalStateCount.canceledCount}</strong>???{' '}
                    <span className="dash">|</span>
                  </span>
                )}
                {cubeClassroom && cubeClassroom.enrolling && cubeClassroom.enrolling.enrollingAvailable && (
                  <>
                    ?????? <strong>{cubeClassroom.capacity}</strong>???
                  </>
                )}
              </Grid.Column>
              <Grid.Column width={8}>
                <div className="right">
                  <Pagination.LimitSelect allViewable={false} />
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>

          <Loader loaderText={loaderText && loaderText}>
            <StudentInformationListView
              checkAll={this.checkAll}
              checkOne={this.checkOne}
              handleRejectReasonWin={this.handleRejectReasonWin}
              students={students}
              selectedList={selectedStudents}
              studentsProfile={studentsProfile}
              startNo={startNo}
            />
          </Loader>
          <SubActions>
            {/*{cubeType === CubeType.ClassRoomLecture || cubeType === CubeType.ELearning ? (*/}
            {/*  <SubActions.Right>*/}
            {/*    {cubeClassroom &&*/}
            {/*      cubeClassroom.id &&*/}
            {/*      new Date(startYear, startMonth, startDate, 0, 0, 0).getTime() <= today.getTime() &&*/}
            {/*      new Date(endYear, endMonth, endDate, 23, 59, 59).getTime() >= today.getTime() && (*/}
            {/*        <Button onClick={this.changeLearningStateProgress} type="button">*/}
            {/*          ????????????*/}
            {/*        </Button>*/}
            {/*      )}*/}
            {/*    <Button onClick={this.acceptStudents} type="button">*/}
            {/*      ??????*/}
            {/*    </Button>*/}
            {/*    <Button onClick={this.onOpenCompanion} type="button">*/}
            {/*      ??????*/}
            {/*    </Button>*/}
            {/*  </SubActions.Right>*/}
            {/*) : (*/}
            {/*  ''*/}
            {/*)}*/}
          </SubActions>
          <SubActions>
            {!isEnrollment && (
              <SubActions.Left>
                <span>????????? ?????? </span>
                <CardByCubeModal cubeId={cubeId} defaultValue={selectedCardByCube} />
                {(selectedCardByCube && selectedCardByCube.card && selectedCardByCube.card.id && (
                  <>
                    &nbsp;&nbsp;{getPolyglotToAnyString(selectedCardByCube.card.name)}&nbsp;&nbsp;
                    <ManagerListModal
                      handleOk={(member, memberList) => this.handleManagerModalOk(member, memberList)}
                      buttonName="?????? ??????"
                      multiSelect
                    />
                    <Button onClick={() => this.onChangeOpen()} type="button">
                      ?????? ??????(??????)
                    </Button>
                  </>
                )) ||
                  '????????? ?????? ????????? ?????????.'}
              </SubActions.Left>
            )}

            <SubActions.Right>
              <SendEmailModal
                onShow={this.checkEmail}
                emailList={selectedEmails}
                nameList={selectedNames}
                idList={selectedIds}
                cubeId={cubeId}
                cubeName={getPolyglotToAnyString(cubeName)}
                type={SelectType.mailOptions[1].value}
                sendCount={count}
                tooltipText="????????? ???????????? ??????????????? ????????? ????????? ?????? ???????????? ???????????? ?????? ?????????"
                studentQuery={studentQuery}
              />
              <SendSmsModal
                onShow={this.checkSms}
                idList={selectedIds}
                nameList={selectedNames}
                cubeId={cubeId}
                cubeName={getPolyglotToAnyString(cubeName)}
                type={SelectType.mailOptions[1].value}
                sendCount={count}
                tooltipText="????????? ???????????? SMS????????? ????????? ????????? ?????? ???????????? ???????????? ?????? ?????????"
                studentQuery={studentQuery}
              />
              {!isEnrollment && (
                <>
                  <Button onClick={this.handleDelete} type="button">
                    ??????
                  </Button>
                </>
              )}
              <SubActions.ExcelButton download onClick={this.onDownloadExcel} />
            </SubActions.Right>
          </SubActions>
          <Pagination.Navigator />
        </Pagination>

        <CompanionModal
          open={companionModalWin}
          handleClose={this.handleCloseCompanion}
          handleOk={this.rejectStudents}
          onChangeStudentRequestProps={this.onChangeStudentApprovalProps}
        />
        <RejectionReasonModal
          open={rejectionReasonModalWin}
          handleClose={this.handleCloseRejectionReason}
          message={rejectionMessage}
        />
        <ExcelReadModal
          open={excelReadModalWin}
          onChangeOpen={this.onChangeOpen}
          fileName={fileName}
          uploadFile={this.uploadFile}
          onReadExcel={this.onReadExcel}
        />
        <CubeStudentExcelUploadFailureListModal
          open={failedModalOpen}
          failedList={failedList}
          text={modalText}
          onClosed={this.onFailedModalClosed}
        />
      </>
    );
  }
}

export default withRouter(CubeStudentInformationContainer);
