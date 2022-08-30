import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Button, Grid, Select } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import XLSX from 'xlsx';

import { reactAlert, reactAutobind, ReactComponent } from '@nara.platform/accent';

import { PageModel, SortFilterState, SelectType, SelectTypeModel } from 'shared/model';
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
import { SearchBoxService } from 'shared/components/SearchBox';

import { ClassroomGroupService, CubeService } from 'cube';
import { ClassroomModel } from 'cube/classroom';
import { CubeStudentService } from 'cube/cube';
import { StudentProfileModel } from 'card/student/model/vo/StudentProfileModel';
import { StudentLearningStateUdo } from 'card/student/model/vo/StudentLearningStateUdo';
import { StudentResultXlsxModel } from 'card/student/model/vo/StudentXlsxModel';
import { UserService } from 'user';
import { StudentService } from 'student';
import { setReportViewModel } from 'student/store/ReportStore';
import { StudentWithUserIdentity } from 'student/model/StudentWithUserIdentity';
import { StudentModel } from 'student/model/StudentModel';
import { ScoringState } from 'student/model/vo/ScoringState';
import { StudentQueryModel } from 'student/model/StudentQueryModel';
import { StudentCountType } from 'student/model/vo/StudentCountType';
import { getResultManagementViewModel, setResultManagementViewModel } from 'student/store/ResultManagementStore';
import { setStudentLectureId } from 'lecture/student/store/StudentLectureIdStore';
import AnswerSheetService from 'survey/answer/present/logic/AnswerSheetService';
import { MemberService } from 'approval';

import { RollBookService } from '../../../index';
import { LearningState } from '../../model/LearningState';
import CubeResultManagementListView from '../view/CubeResultManagementListView';
import ResultManagementSearchBox from '../view/ResultManagementSearchBox';
import { ResultManagementModalContainer } from './ResultManagementModalContainter';

interface Props extends RouteComponentProps<Params> {}

interface Params {
  cubeId: string;
  cubeType: string;
}

interface States {
  alertWinForSearchBoxOpen: boolean;
  studentAll: string;

  alertWinOpen: boolean;
  alertWinOpenForMissed: boolean;
  alertWinOpenForNoShow: boolean;
  alertWinOpenForWait: boolean;
  alertIcon: string;
  alertTitle: string;
  alertType: string;
  alertMessage: any;
  studentAudienceKey: string;
  reportModalOpen: boolean;

  learningStateSelect: SelectTypeModel[];
}

interface Injected {
  sharedService: SharedService;
  rollBookService: RollBookService;
  classroomGroupService: ClassroomGroupService;
  surveyAnswerSheetService: AnswerSheetService;
  studentService: StudentService;
  cubeStudentService: CubeStudentService;
  userService: UserService;
  cubeService: CubeService;
  memberService: MemberService;
  sendSmsService: SendSmsService;
  searchBoxService: SearchBoxService;
}
@inject(
  'sharedService',
  'studentService',
  'rollBookService',
  'classroomGroupService',
  'surveyAnswerSheetService',
  'studentService',
  'cubeStudentService',
  'userService',
  'cubeService',
  'memberService',
  'sendSmsService',
  'searchBoxService'
)
@observer
@reactAutobind
class CubeResultManagementContainer extends ReactComponent<Props, States, Injected> {
  //
  examModal: any = null;
  paginationKey = 'resultManagement';

  constructor(props: Props) {
    super(props);
    this.state = {
      alertWinForSearchBoxOpen: false,
      studentAll: 'No',
      alertWinOpen: false,
      alertIcon: '',
      alertTitle: '',
      alertType: '',
      alertMessage: '',
      alertWinOpenForMissed: false,
      alertWinOpenForNoShow: false,
      alertWinOpenForWait: false,
      studentAudienceKey: '',
      reportModalOpen: false,
      learningStateSelect: SelectType.scoringLearningState,
    };

    this.injected.cubeStudentService.clearResultStudentQuery();
  }

  componentDidMount() {
    //
    this.injected.cubeStudentService.clearSelectedStudents();
    this.injected.studentService.clearSelected();

    const { userService, sendSmsService } = this.injected;
    userService.findUser(); // 사용자 폰번호 조회용
    // 권한 체크
    sendSmsService.findMySmsSenderAllowed();
  }

  async findStudentsBySearch() {
    //
    const { cubeStudentService, classroomGroupService, sharedService } = this.injected;
    const { resultStudentQuery } = cubeStudentService;
    const { cubeId } = this.props.match.params;
    const pageModel = sharedService.getPageModel(this.paginationKey);

    // const round = classroomGroupService.cubeClassroom.round || 1;
    // cubeStudentService.changeResultStudentQueryProps('round', round);
    cubeStudentService.changeResultStudentQueryProps('studentOrderBy', SortFilterState.ModifiedTimeDesc);

    cubeStudentService.clearSelectedStudents();

    const offsetElementList = await cubeStudentService.findStudentByCubeRdo(
      StudentQueryModel.asResultByCubeRdo(resultStudentQuery, cubeId, pageModel)
    );
    // await this.setStudentInfo(cubeStudentService.students);

    sharedService.setCount(this.paginationKey, offsetElementList.totalCount);

    await cubeStudentService.countStudent(
      StudentQueryModel.asStudentTestCountRdo(
        cubeStudentService.resultStudentQuery,
        cubeId,
        StudentCountType.PROPOSAL_AND_LEARNING_STATE
      )
    );
  }

  async setStudentInfo(students: StudentWithUserIdentity[]) {
    //
    const { cubeStudentService, memberService } = this.injected;
    const { setStudentProfile } = cubeStudentService;

    const ids: string[] = students.map((student) => student.student.patronKey.keyString);

    const members = await memberService.findMemberByIds(ids);

    const map: Map<string, StudentProfileModel> = new Map<string, StudentProfileModel>();

    await members.map((member) => {
      map.set(
        member.patronKey.keyString,
        new StudentProfileModel({
          id: member.patronKey.keyString,
          company: member.companyName,
          department: member.departmentName,
          email: member.email,
        })
      );
    });

    setStudentProfile(map);
  }

  ////////

  async init() {
    //
    const { cubeStudentService } = this.injected;
    const { cubeId } = this.props.match.params;

    // students
    await this.findStudentsBySearch();

    // cubeStudentService.changeStudentQueryProps('studentCountType', StudentCountType.LEARNING_STATE);
  }

  onChangeStudentQueryProp(name: string, value: any) {
    //
    const { cubeStudentService } = this.injected;
    cubeStudentService.changeResultStudentQueryProps(name, value);
    // if (name === 'scoringState' && value !== '전체') {
    //   console.log(name);
    //   cubeStudentService.changeStudentQueryProps('learningState', '');
    // }
    //
    // if (name === 'learningState' && value !== '') {
    //   console.log(name);
    //   cubeStudentService.changeStudentQueryProps('scoringState', '전체');
    // }
  }

  async changeRound(name: string, value: any) {
    //
    const { cubeStudentService } = this.injected;
    cubeStudentService.changeResultStudentQueryProps(name, value);
    this.setClassroom(value);

    await this.findStudentsBySearch();
  }

  setClassroom(round: number): void {
    const { cubeService, classroomGroupService } = this.injected;
    if (cubeService.cubeDetail.cubeMaterial.classrooms) {
      const classroom = cubeService.cubeDetail.cubeMaterial.classrooms.find((target) => target.round === round);
      classroomGroupService.setCubeClassroom(classroom || new ClassroomModel());
    }
  }

  countRound(): any[] {
    //
    const { classroomGroupService, cubeService } = this.injected;
    const { cubeClassrooms } = classroomGroupService;
    const { cubeDetail } = this.injected.cubeService;
    const roundList: any = [{ key: `전체`, text: `전체`, value: null }];

    if (cubeClassrooms.length > 0 && cubeClassrooms[0].id !== '') {
      cubeClassrooms.forEach((classroom, index) => {
        roundList.push({ key: classroom.round, text: `${classroom.round}차수`, value: classroom.round });
      });
    } else {
      roundList.push({ key: 1, text: `1차수`, value: 1 });
    }

    return roundList;
  }

  removeInList(index: number, oldList: string[]) {
    //
    return oldList.slice(0, index).concat(oldList.slice(index + 1));
  }

  checkOne(index: number, student: StudentWithUserIdentity, value: any): void {
    // this.injected.cubeStudentService.onChangeTargetStudentProp(index, 'selected', value);
    const { cubeStudentService } = this.injected;
    const { selectedStudents } = cubeStudentService;
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

    changeSelectedStudentEmails(targetList.map((target) => target.userIdentity.email));
    changeSelectedStudentNames(targetList.map((target) => target.student.name));
    changeSelectedStudentUserIds(targetList.map((target) => target.userIdentity.id));
    changeSelectedStudentIds(targetList.map((target) => target.student.id));
  }

  checkAll(isChecked: boolean) {
    //
    const { cubeStudentService, studentService } = this.injected;
    const {
      changeSelectedStudentEmails,
      changeSelectedStudentNames,
      changeSelectedStudentUserIds,
      changeSelectedStudentIds,
      studentsProfile,
    } = studentService;
    const { students } = cubeStudentService;

    if (isChecked) {
      cubeStudentService.setSelectedStudents(students);

      changeSelectedStudentEmails(students.map((target) => target.userIdentity.email));
      changeSelectedStudentNames(students.map((target) => target.student.name));
      changeSelectedStudentUserIds(students.map((target) => target.userIdentity.id));
      changeSelectedStudentIds(students.map((target) => target.student.id));
    } else {
      cubeStudentService.setSelectedStudents([]);
      changeSelectedStudentEmails([]);
      changeSelectedStudentNames([]);
      changeSelectedStudentUserIds([]);
      changeSelectedStudentIds([]);
    }
  }

  onChangeStudentsForModifyProps(index: number, name: string, value: any) {
    //
    const { cubeStudentService } = this.injected;
    cubeStudentService.onChangeTargetStudentProp(index, name, value);
  }

  changeDateToString(date: Date) {
    //
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    const year = date.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    return [year, month, day].join('.');
  }

  async onDownloadExcel() {
    //
    const { cubeStudentService, memberService, cubeService } = this.injected;
    const { resultStudentQuery } = cubeStudentService;
    const { cubeDetail } = cubeService;
    const { cubeId } = this.props.match.params;
    const fileBoxId = cubeDetail.cubeContents.reportFileBox.fileBoxId;
    const reportName = cubeDetail.cubeContents.reportFileBox.reportName;
    const surveyId = cubeDetail.cubeContents.surveyId;

    cubeStudentService.changeResultStudentQueryProps('studentOrderBy', SortFilterState.ModifiedTimeDesc);

    const studentsForExcel = await cubeStudentService.findStudentByCubeRdoForExcel(
      StudentQueryModel.asResultByCubeRdo({ ...resultStudentQuery, round: undefined }, cubeId, new PageModel(0, 99999))
    );

    const wbList: StudentResultXlsxModel[] = [];
    studentsForExcel.results.forEach((student) => {
      wbList.push(
        StudentModel.asCubeStudentsResultXLSX(new StudentWithUserIdentity(student), {
          reportName: getPolyglotToAnyString(reportName),
          fileBoxId,
          surveyId,
        })
      );
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

    // await this.findStudentsBySearch();
  }

  handleMarkExam(studentDenizenId: string, lectureId: string, finished: boolean) {
    this.setState({ studentAudienceKey: studentDenizenId });

    const resultManagementViewModel = getResultManagementViewModel();

    if (resultManagementViewModel !== undefined) {
      setResultManagementViewModel({
        ...resultManagementViewModel,
        gradeModalOpen: true,
        gradeFinished: finished,
        onOk: this.findStudentsBySearch,
      });
    }
    setStudentLectureId({
      studentDenizenId,
      lectureId,
    });
  }

  // onSearchStudentsBySearchBox() {
  //   //
  //   const { cubeStudentService } = this.injected;
  //   const studentQueryObject = StudentQueryModel.isBlank(cubeStudentService.studentQuery);
  //   if (studentQueryObject === 'success') {
  //     this.findStudentsBySearch();
  //     return;
  //   }
  //   if (studentQueryObject !== 'success') {
  //     this.setState({ alertWinForSearchBoxOpen: true });
  //   }
  // }

  async onModifyLearningStateChange(learningState: LearningState): Promise<void> {
    //
    const { cubeStudentService } = this.injected;
    const { selectedStudents } = cubeStudentService;

    if (selectedStudents.length === 0) {
      alert(AlertModel.getCustomAlert(false, '안내', '학습자를 선택하세요.', '확인'));
      return;
    }

    if (
      learningState === LearningState.Passed &&
      selectedStudents.filter((student) => student.student.learningState === LearningState.Passed).length > 0
    ) {
      alert(AlertModel.getCustomAlert(false, '안내', '이수 처리된 사용자가 선택되었습니다.', '확인'));
      return;
    } else if (
      learningState === LearningState.Missed &&
      selectedStudents.filter((student) => student.student.learningState === LearningState.Missed).length > 0
    ) {
      alert(AlertModel.getCustomAlert(false, '안내', '미이수 처리된 사용자가 선택되었습니다.', '확인'));
      return;
    } else if (
      learningState === LearningState.NoShow &&
      selectedStudents.filter((student) => student.student.learningState === LearningState.NoShow).length > 0
    ) {
      alert(AlertModel.getCustomAlert(false, '안내', '불참 처리된 사용자가 선택되었습니다.', '확인'));
      return;
    } else if (
      learningState === LearningState.Progress &&
      selectedStudents.filter((student) => student.student.learningState === LearningState.Progress).length > 0
    ) {
      alert(AlertModel.getCustomAlert(false, '안내', '결과처리대기 처리된 사용자가 선택되었습니다.', '확인'));
      return;
    }

    let title = '';
    let message = '';

    if (learningState === LearningState.Passed) {
      title = '이수처리 요청 안내';
      message = '선택한 학습자를 이수처리 하시겠습니까?';
    } else if (learningState === LearningState.Missed) {
      title = '미이수처리 요청 안내';
      message = '선택한 학습자를 미이수처리 하시겠습니까?';
    } else if (learningState === LearningState.NoShow) {
      title = '불참처리 요청 안내';
      message = '선택한 학습자를 불참처리 하시겠습니까?';
    } else if (learningState === LearningState.Progress) {
      title = '결과처리대기 요청 안내';
      message = '선택한 학습자를 결과처리대기 하시겠습니까?';
    } else {
      return;
    }

    confirm(
      ConfirmModel.getCustomConfirm(title, message, false, '확인', '취소', () => {
        this.modifyLearningState(
          selectedStudents.map((student) => student.student.id),
          learningState
        );
      })
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

  // setStudentCountForFind(name: string, value: string) {
  //   //
  //   const { cubeStudentService } = this.injected;
  //   cubeStudentService.changeResultStudentQueryProps(name, value);
  //
  //   this.findStudentsBySearch();
  //   // if (cubeStudentService) { cubeStudentService.findAllStudents(); }
  // }

  reportModalShow(student: StudentWithUserIdentity, finished: boolean) {
    const { cubeService } = this.injected;
    const reportFileBox = cubeService.cubeDetail.cubeContents.reportFileBox;
    // cubeStudentService.findStudent(student.id).then((student) => {
    //   cubeStudentService.reportModalShow(student);
    // this.setState({ reportModalOpen: true });
    // });

    const homework = {
      reportName: reportFileBox.reportName,
      reportQuestion: reportFileBox.reportQuestion,
      homeworkContent: student.student.homeworkContent,
      homeworkFileBoxId: student.student.homeworkFileBoxId,
    };

    setReportViewModel({
      studentId: student.student.id,
      homework,
      homeworkOperatorComment: student.student.homeworkOperatorComment,
      homeworkOperatorFileBoxId: student.student.homeworkOperatorFileBoxId,
      homeworkScore: student.student.studentScore.homeworkScore,
      homeworkState: student.student.extraWork.reportStatus,
    });

    const resultManagementViewModel = getResultManagementViewModel();
    if (resultManagementViewModel !== undefined) {
      setResultManagementViewModel({
        ...resultManagementViewModel,
        reportModalOpen: true,
        reportFinished: finished,
        onOk: this.findStudentsBySearch,
      });
    }
  }

  checkEmail(): boolean {
    // const { cubeStudentService } = this.injected;
    // const { selectedStudents } = cubeStudentService;

    // if (selectedStudents.length <= 0) {
    //   reactAlert({
    //     title: '알림',
    //     message: '학습자를 선택하세요.',
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
        title: '알림',
        message: '학습자가 없습니다.',
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
        title: '알림',
        message: '학습자가 없습니다.',
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
        title: '알림',
        message: 'SMS 발송 권한이 없으므로 Help Desk(02-6323-9002)로 문의 주시기 바랍니다',
        onClose: () => {},
        warning: false,
      });
      return false;
    }
  }

  onChangeScoringState(value: string) {
    //
    const { changePropsFn } = this.injected.searchBoxService;
    changePropsFn('learningState', LearningState.Empty);

    if (value === ScoringState.Waiting) {
      //
      this.setState({ learningStateSelect: SelectType.waitingLearningState });
      changePropsFn('learningState', LearningState.Progress);
    } else if (value === ScoringState.Missing) {
      //
      this.setState({ learningStateSelect: SelectType.missingLearningState });
    } else {
      //
      this.setState({ learningStateSelect: SelectType.scoringLearningState });
    }
  }

  render() {
    const { cubeStudentService, cubeService, studentService } = this.injected;
    const { students, resultStudentQuery, studentCount, selectedStudents, studentsProfile } = cubeStudentService;
    const { selectedIds, selectedEmails, selectedNames } = studentService;
    const { cubeDetail } = cubeService;
    const { studentAll, learningStateSelect } = this.state;

    const { startNo, count } = this.injected.sharedService.getPageModel(this.paginationKey);
    const { cubeId } = this.props.match.params;
    const cubeName = cubeService.cubeDetail.cube.name;

    const fileBoxId = cubeDetail.cubeContents.reportFileBox.fileBoxId;
    const reportName = cubeDetail.cubeContents.reportFileBox.reportName;
    const surveyId = cubeDetail.cubeContents.surveyId;
    const learningStateCount = studentCount.learningStateCount;

    const hasTest =
      (cubeDetail.cubeContents.tests &&
        cubeDetail.cubeContents.tests.length > 0 &&
        cubeDetail.cubeContents.tests[0].paperId != null) ||
      false;

    const hasReport =
      !!(
        cubeDetail.cubeContents.reportFileBox?.fileBoxId ||
        getPolyglotToAnyString(cubeDetail.cubeContents.reportFileBox?.reportName)
      ) || false;

    return (
      <>
        <ResultManagementSearchBox
          onSearchPostsBySearchBox={this.findStudentsBySearch}
          onChangeStudentQueryProp={this.onChangeStudentQueryProp}
          onChangeScoringState={this.onChangeScoringState}
          learningStateSelect={learningStateSelect}
          hasTest={hasTest}
          hasReport={hasReport}
          studentQuery={resultStudentQuery}
          paginationKey={this.paginationKey}
        />
        <Pagination name={this.paginationKey} onChange={this.findStudentsBySearch}>
          <Grid className="list-info">
            <Grid.Row>
              <Grid.Column width={8}>
                <Select
                  className="ui small-border dropdown m0"
                  // value={resultStudentQuery.round || 1}
                  // control={Select}
                  options={this.countRound()}
                  onChange={(e: any, data: any) => this.changeRound('round', data.value)}
                  placeholder="전체"
                />
                {studentCount && (
                  <span>
                    전체 <strong>{studentCount.proposalStateCount.approvedCount}</strong>명{' '}
                    <span className="dash">|</span>
                    결과처리대기
                    <strong>
                      {learningStateCount.progressCount +
                        learningStateCount.waitingCount +
                        learningStateCount.testWaitingCount +
                        learningStateCount.homeworkWaitingCount +
                        learningStateCount.failedCount +
                        learningStateCount.testPassedCount}
                    </strong>
                    <span className="dash">|</span>
                    이수 <strong>{learningStateCount.passedCount}</strong>명 <span className="dash">|</span>
                    미이수 <strong>{learningStateCount.missedCount}</strong>명<span className="dash">|</span>
                    불참 <strong>{learningStateCount.noShowCount}</strong>명
                  </span>
                )}
              </Grid.Column>
              <Grid.Column width={8}>
                <div className="right">
                  <Pagination.LimitSelect allViewable={false} />
                  <SubActions.ExcelButton download onClick={this.onDownloadExcel} />
                  <SendEmailModal
                    onShow={this.checkEmail}
                    emailList={selectedEmails}
                    nameList={selectedNames}
                    idList={selectedIds}
                    cubeId={cubeId}
                    cubeName={getPolyglotToAnyString(cubeName)}
                    type={SelectType.mailOptions[1].value}
                    sendCount={count}
                    tooltipText="학습자 선택없이 메일보내기 클릭시 검색된 전체 학습자가 수신자로 지정 됩니다"
                    studentQuery={resultStudentQuery}
                  />
                  <SendSmsModal
                    onShow={this.checkSms}
                    idList={selectedIds}
                    nameList={selectedNames}
                    cubeId={cubeId}
                    cubeName={getPolyglotToAnyString(cubeName)}
                    type={SelectType.mailOptions[1].value}
                    sendCount={count}
                    tooltipText="학습자 선택없이 SMS보내기 클릭시 검색된 전체 학습자가 수신자로 지정 됩니다"
                    studentQuery={resultStudentQuery}
                  />
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>

          <Loader>
            <CubeResultManagementListView
              checkAll={this.checkAll}
              checkOne={this.checkOne}
              onChangeStudentsTargetProps={this.onChangeStudentsForModifyProps}
              handleMarkExam={this.handleMarkExam}
              reportModalShow={this.reportModalShow}
              selectedList={selectedStudents}
              students={students}
              studentAll={studentAll}
              startNo={startNo}
              hasTest={hasTest}
              fileBoxId={fileBoxId}
              reportName={getPolyglotToAnyString(reportName)}
              surveyId={surveyId}
              studentsProfile={studentsProfile}
            />
          </Loader>

          <SubActions>
            <SubActions.Right>
              <Button onClick={() => this.onModifyLearningStateChange(LearningState.Passed)}>이수</Button>
              <Button onClick={() => this.onModifyLearningStateChange(LearningState.Missed)}>미이수</Button>
              <Button onClick={() => this.onModifyLearningStateChange(LearningState.NoShow)}>불참</Button>
              <Button onClick={() => this.onModifyLearningStateChange(LearningState.Progress)}>결과처리대기</Button>
            </SubActions.Right>
          </SubActions>
          <Pagination.Navigator />
        </Pagination>
        <ResultManagementModalContainer />
      </>
    );
  }
}

export default withRouter(CubeResultManagementContainer);
