import React from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Checkbox, Container, Form, Grid, Table } from 'semantic-ui-react';
import XLSX from 'xlsx';
import moment from 'moment';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectType, SortFilterState, SelectTypeModel } from 'shared/model';
import { SharedService, SendSmsService } from 'shared/present';
import {
  alert,
  AlertModel,
  confirm,
  ConfirmModel,
  Loader,
  Pagination,
  SearchBox,
  SubActions,
  SendEmailModal,
  SendSmsModal,
} from 'shared/components';
import { SearchBoxService } from 'shared/components/SearchBox';
import { getDefaultLanguage, getPolyglotToAnyString } from 'shared/components/Polyglot';

import { MemberService } from '../../../../approval';
import { LearningState } from '../../../../student/model/vo/LearningState';
import { CardQueryModel } from '../../../card';
import { AnswerSheetService } from '../../../../survey';
import { CardContentsQueryModel } from '../../../card/model/CardContentsQueryModel';

import { displayLearningState, removeInList } from '../../../../lecture/student/ui/logic/StudentHelper';
import { ExtraWorkState } from 'student/model/vo/ExtraWorkState';
import CardResultManagementView from '../view/CardResultManagementView';
import {
  getResultManagementViewModel,
  setResultManagementViewModel,
} from '../../../../student/store/ResultManagementStore';

import { setReportViewModel } from '../../../../student/store/ReportStore';
import { StudentService } from '../../../../student';
import { StudentModel } from '../../../../student/model/StudentModel';
import { StudentXlsxForTestModel } from '../../../../student/model/StudentXlsxForTestModel';
import { ScoringState } from '../../../../student/model/vo/ScoringState';
import { ProposalState } from '../../../../student/model/vo/ProposalState';
import { ResultManagementModalContainer } from 'lecture/student/ui/logic/ResultManagementModalContainter';
import { setStudentLectureId } from 'lecture/student/store/StudentLectureIdStore';
import { StudentWithUserIdentity } from '../../../../student/model/StudentWithUserIdentity';
import { UserService } from 'user';

interface Props {
  cardId: string;
  surveyFormId: string;
  surveyCaseId: string;
  cardQuery: CardQueryModel;
  cardContentsQuery: CardContentsQueryModel;
}

interface States {
  studentAudienceKey: string;
  learningStateSelect: SelectTypeModel[];
}

interface Injected {
  sharedService: SharedService;
  studentService: StudentService;
  memberService: MemberService;
  surveyAnswerSheetService: AnswerSheetService;
  searchBoxService: SearchBoxService;
  userService: UserService;
  sendSmsService: SendSmsService;
}

@inject(
  'sharedService',
  'studentService',
  'memberService',
  'surveyAnswerSheetService',
  'searchBoxService',
  'studentService',
  'userService',
  'sendSmsService'
)
@observer
@reactAutobind
class CardResultManagementContainer extends ReactComponent<Props, States, Injected> {
  //
  paginationKey = 'cardResult';

  examModal: any = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      studentAudienceKey: '',
      learningStateSelect: SelectType.scoringLearningState,
    };

    const { clearQuery, clearSelected, changeStudentQueryProps } = this.injected.studentService;
    const cardId = this.props;

    clearQuery();
    clearSelected();
    changeStudentQueryProps('cardId', cardId);
  }

  componentDidMount() {
    //
    const { userService, sendSmsService } = this.injected;
    userService.findUser(); // ????????? ????????? ?????????
    // ?????? ??????
    sendSmsService.findMySmsSenderAllowed();
  }

  //
  async findStudentResult() {
    //
    const { cardId } = this.props;
    const { studentService, sharedService } = this.injected;

    const {
      findCardStudents,
      changeSelectedStudents,
      changeSelectedStudentIds,
      changeSelectedStudentEmails,
      changeSelectedStudentNames,
      changeSelectedStudentUserIds,
    } = studentService;

    studentService.changeStudentQueryProps('cardId', cardId);
    studentService.changeStudentQueryProps('proposalState', ProposalState.Approved);
    studentService.changeStudentQueryProps('studentOrderBy', SortFilterState.ModifiedTimeDesc);

    const pageModel = this.injected.sharedService.getPageModel(this.paginationKey);

    const totalCount = await findCardStudents(pageModel);

    changeSelectedStudentIds([]);
    changeSelectedStudents([]);
    changeSelectedStudentEmails([]);
    changeSelectedStudentNames([]);
    changeSelectedStudentUserIds([]);

    // await setStudentInfo(studentService.students, studentService, memberService);

    sharedService.setCount(this.paginationKey, totalCount);

    await studentService.findStudentCount(cardId);
  }

  checkOne(studentWiths: StudentWithUserIdentity) {
    //
    const { student, userIdentity } = studentWiths;

    const studentId = student.id;
    const {
      selectedIds,
      selectedStudents,
      selectedEmails,
      selectedNames,
      selectedUserIds,
      changeSelectedStudentIds,
      changeSelectedStudents,
      changeSelectedStudentEmails,
      changeSelectedStudentNames,
      changeSelectedStudentUserIds,
    } = this.injected.studentService;

    const tempList: string[] = [...selectedIds];
    const tempList1: StudentModel[] = [...selectedStudents];

    if (tempList.indexOf(studentId) !== -1) {
      const newTempStudentList = removeInList(tempList.indexOf(studentId), tempList);
      const newTempLearningStateList = removeInList(tempList.indexOf(studentId), tempList1);

      changeSelectedStudentIds(newTempStudentList);
      changeSelectedStudents(newTempLearningStateList);
    } else {
      tempList.push(studentId);
      tempList1.push(student);

      changeSelectedStudentIds(tempList);
      changeSelectedStudents(tempList1);
    }

    // ????????? ????????? ?????? ?????? by gon 20210222
    const copiedSelectedEmailList: string[] = [...selectedEmails];
    const copiedSelectedNameList: string[] = [...selectedNames];
    const copiedSelectedUserIdList: string[] = [...selectedUserIds];
    const index = copiedSelectedUserIdList.indexOf(userIdentity.email);

    if (index >= 0) {
      const newSelectedEmailList = copiedSelectedEmailList
        .slice(0, index)
        .concat(copiedSelectedEmailList.slice(index + 1));
      changeSelectedStudentEmails(newSelectedEmailList);

      const newSelectedNameList = copiedSelectedNameList
        .slice(0, index)
        .concat(copiedSelectedNameList.slice(index + 1));
      changeSelectedStudentNames(newSelectedNameList);

      const newSelectedUserIdList = copiedSelectedUserIdList
        .slice(0, index)
        .concat(copiedSelectedUserIdList.slice(index + 1));
      changeSelectedStudentUserIds(newSelectedUserIdList);
    } else {
      copiedSelectedEmailList.push(student.email);
      changeSelectedStudentEmails(copiedSelectedEmailList);

      copiedSelectedNameList.push(student.name);
      changeSelectedStudentNames(copiedSelectedNameList);

      copiedSelectedUserIdList.push(student.id);
      changeSelectedStudentUserIds(copiedSelectedUserIdList);
    }
  }

  checkAll(isChecked: string) {
    //
    const {
      students,
      changeSelectedStudentIds,
      changeSelectedStudents,
      changeSelectedStudentEmails,
      changeSelectedStudentNames,
      changeSelectedStudentUserIds,
    } = this.injected.studentService;

    const allList: string[] = [];
    const allStudents: StudentModel[] = [];
    const allEmailList: string[] = [];
    const allNameList: string[] = [];
    const allUserIdList: string[] = [];

    if (isChecked) {
      students.forEach((studentWiths) => {
        allList.push(studentWiths.student.id);
        allStudents.push(studentWiths.student);
        allEmailList.push(studentWiths.userIdentity.email);
        allNameList.push(studentWiths.student.name);
        allUserIdList.push(studentWiths.userIdentity.id);
      });

      changeSelectedStudentIds(allList);
      changeSelectedStudents(allStudents);
      changeSelectedStudentEmails(allEmailList);
      changeSelectedStudentNames(allNameList);
      changeSelectedStudentUserIds(allUserIdList);
    } else {
      changeSelectedStudentIds([]);
      changeSelectedStudents([]);
      changeSelectedStudentEmails([]);
      changeSelectedStudentNames([]);
      changeSelectedStudentUserIds([]);
    }
  }

  async onClickDownExcel() {
    //
    const { cardId } = this.props;
    const { cardQuery, cardContentsQuery } = this.props;
    const { studentService } = this.injected;

    const paperId =
      cardContentsQuery.tests && cardContentsQuery.tests.length > 0 ? cardContentsQuery.tests[0].paperId : '';
    const fileBoxId = cardContentsQuery.reportFileBox.fileBoxId;
    const reportName = cardContentsQuery.reportFileBox.reportName;

    studentService.changeStudentQueryProps('cardId', cardId);
    studentService.changeStudentQueryProps('proposalState', ProposalState.Approved);
    studentService.changeStudentQueryProps('studentOrderBy', SortFilterState.ModifiedTimeDesc);

    const { findAllCardStudents } = studentService;

    const students = await findAllCardStudents();

    const wbList: StudentXlsxForTestModel[] = [];

    students?.forEach((studentWiths) => {
      wbList.push(StudentModel.asXLSXForTest(studentWiths, paperId, reportName, fileBoxId, cardContentsQuery.surveyId));
    });

    const studentResultExcel = XLSX.utils.json_to_sheet(wbList);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, studentResultExcel, 'Students');

    const date = moment().format('YYYY-MM-DD_HH:mm:ss');
    const time = new Date().toLocaleTimeString('en-GB');
    const fileName = `${getPolyglotToAnyString(cardQuery.name)}-????????????.${date}:${time}.xlsx`;
    XLSX.writeFile(wb, fileName, { compression: true });
    return fileName;
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

  handleMarkExam(studentDenizenId: string, lectureId: string, finished: boolean) {
    const resultManagementViewModel = getResultManagementViewModel();

    if (resultManagementViewModel !== undefined) {
      setResultManagementViewModel({
        ...resultManagementViewModel,
        gradeModalOpen: true,
        gradeFinished: finished,
        onOk: this.findStudentResult,
      });
    }

    setStudentLectureId({
      studentDenizenId,
      lectureId,
    });

    this.setState({ studentAudienceKey: studentDenizenId });
  }

  onClickModifyStudentsState(state: LearningState) {
    //
    const { studentService } = this.injected;
    const { selectedIds, selectedStudents } = studentService;
    const displayState = displayLearningState(state);

    if (selectedIds.length === 0) {
      alert(AlertModel.getRequiredChoiceAlert('?????????'));
      return;
    }

    for (let i = 0; i < selectedStudents.length; i++) {
      //
      const student = selectedStudents[i];

      if (state === LearningState.Passed && student.phaseCount !== student.completePhaseCount) {
        alert(AlertModel.getCustomAlert(false, '??????', '????????? ???????????? ?????? ???????????? ????????????.', '??????'));
        return;
      }

      if (state === student.learningState) {
        alert(
          AlertModel.getCustomAlert(
            false,
            '??????',
            `${displayLearningState(state)} ????????? ???????????? ?????????????????????.`,
            '??????'
          )
        );
        return;
      }
    }

    confirm(
      ConfirmModel.getCustomConfirm(
        `${displayState}?????? ?????? ??????`,
        `???????????? ???????????? ${displayState} ?????? ???????????????????`,
        false,
        `${displayState}`,
        '??????',
        () => {
          this.onModifyStudentsState(state);
        }
      ),
      false
    );
  }

  async onModifyStudentsState(state: LearningState) {
    //
    const { modifyStudentsLearningState, selectedIds } = this.injected.studentService;
    const displayState = displayLearningState(state);

    await modifyStudentsLearningState(selectedIds, state);
    await alert(
      AlertModel.getCustomAlert(
        false,
        '??????',
        `??????????????? ${displayState} ?????? ???????????????.`,
        '??????',
        this.findStudentResult
      )
    );
  }

  // reportModalShow(student: StudentModel) {
  //   //
  //   this.injected.cardStudentService.reportModalShow(student);
  // }

  reportModalShow(student: StudentModel, reportFinished: boolean) {
    //
    const { cardContentsQuery } = this.props;

    const reportFileBox = cardContentsQuery.reportFileBox;
    const homework = {
      reportName: reportFileBox.reportName,
      reportQuestion: reportFileBox.reportQuestion,
      homeworkContent: student.homeworkContent,
      homeworkFileBoxId: student.homeworkFileBoxId,
    };

    setReportViewModel({
      studentId: student.id,
      homework,
      homeworkOperatorComment: student.homeworkOperatorComment,
      homeworkOperatorFileBoxId: student.homeworkOperatorFileBoxId,
      homeworkScore: student.studentScore.homeworkScore,
      homeworkState: student.extraWork.reportStatus,
    });

    const resultManagementViewModel = getResultManagementViewModel();

    if (resultManagementViewModel !== undefined) {
      setResultManagementViewModel({
        ...resultManagementViewModel,
        reportModalOpen: true,
        reportFinished,
        onOk: this.findStudentResult,
      });
    }
  }

  renderExam(student: StudentModel) {
    //
    const { cardContentsQuery } = this.props;

    const paperId =
      cardContentsQuery.tests && cardContentsQuery.tests.length > 0 ? cardContentsQuery.tests[0].paperId : '';

    const extraWorks = student.extraWork;

    // ????????? ?????? ??????
    if (paperId === '') {
      return (
        <>
          <Table.Cell textAlign="center">-</Table.Cell>
          <Table.Cell textAlign="center">-</Table.Cell>
          <Table.Cell textAlign="center">-</Table.Cell>
        </>
      );
    }

    if (extraWorks && extraWorks.testStatus && extraWorks.testStatus !== ExtraWorkState.Save) {
      // ?????? ?????? ??????
      if (extraWorks.testStatus === ExtraWorkState.Submit) {
        return (
          <>
            <Table.Cell textAlign="center" />
            <Table.Cell textAlign="center">{student.studentScore.numberOfTrials}</Table.Cell>
            <Table.Cell textAlign="center">
              <Button
                type="button"
                onClick={() => this.handleMarkExam(student.patronKey.keyString, student.lectureId, false)}
              >
                ????????????
              </Button>
            </Table.Cell>
          </>
        );
      } else {
        return (
          <>
            <Table.Cell textAlign="center">{student.studentScore.latestScore}</Table.Cell>
            <Table.Cell textAlign="center">{student.studentScore.numberOfTrials}</Table.Cell>
            <Table.Cell textAlign="center">
              <Button
                type="button"
                onClick={() => this.handleMarkExam(student.patronKey.keyString, student.lectureId, true)}
              >
                ????????????
              </Button>
            </Table.Cell>
          </>
        );
      }
    }

    return (
      <>
        <Table.Cell textAlign="center" />
        <Table.Cell textAlign="center">0</Table.Cell>
        <Table.Cell textAlign="center">?????????</Table.Cell>
      </>
    );
  }

  renderReport(student: StudentModel) {
    //
    const { cardQuery, cardContentsQuery } = this.props;

    const reportName = cardContentsQuery.reportFileBox
      ? getPolyglotToAnyString(cardContentsQuery.reportFileBox.reportName, getDefaultLanguage(cardQuery.langSupports))
      : '';
    const fileBoxId = cardContentsQuery.reportFileBox ? cardContentsQuery.reportFileBox.fileBoxId : '';
    const extraWorks = student.extraWork;

    if ((reportName === '' || reportName === null) && fileBoxId === '') {
      //
      return (
        <>
          <Table.Cell textAlign="center">-</Table.Cell>
          <Table.Cell textAlign="center">-</Table.Cell>
        </>
      );
    }

    if (extraWorks && extraWorks.reportStatus) {
      // ?????? ?????? ??????
      if (extraWorks.reportStatus === ExtraWorkState.Submit) {
        return (
          <>
            <Table.Cell textAlign="center" />
            <Table.Cell textAlign="center">
              <Button type="button" onClick={() => this.reportModalShow(student, false)}>
                ????????????
              </Button>
            </Table.Cell>
          </>
        );
      } else {
        return (
          <>
            <Table.Cell textAlign="center">{student.studentScore.homeworkScore}</Table.Cell>
            <Table.Cell textAlign="center">
              <Button type="button" onClick={() => this.reportModalShow(student, true)}>
                ????????????
              </Button>
            </Table.Cell>
          </>
        );
      }
    }

    return (
      <>
        <Table.Cell textAlign="center" />
        <Table.Cell textAlign="center">?????????</Table.Cell>
      </>
    );
  }

  checkEmail() {
    //
    // const { studentService } = this.injected;
    // if (studentService.selectedEmails.length === 0) {
    //   alert(AlertModel.getCustomAlert(false, '??????', '???????????? ???????????????', '??????'));
    //   return false;
    // } else {
    //   return true;
    // }
    const { sharedService } = this.injected;
    const { count } = sharedService.getPageModel(this.paginationKey);
    // if (count <= 0) {
    //   alert(AlertModel.getCustomAlert(false, '??????', '???????????? ????????????', '??????'));
    //   return false;
    // }
    return true;
  }

  checkSms() {
    // ?????? ??????
    // "SMS ?????? ????????? ???????????? Help Desk(02-6323-9002)??? ?????? ????????? ????????????"
    const { sharedService } = this.injected;
    const { count } = sharedService.getPageModel(this.paginationKey);
    if (count <= 0) {
      alert(AlertModel.getCustomAlert(false, '??????', '???????????? ????????????', '??????'));
      return false;
    }

    const { sendSmsService } = this.injected;
    const { allowed } = sendSmsService;
    if (allowed) {
      return true;
    } else {
      alert(
        AlertModel.getCustomAlert(
          false,
          '??????',
          'SMS ?????? ????????? ???????????? Help Desk(02-6323-9002)??? ?????? ????????? ????????????',
          '??????'
        )
      );
      return false;
    }
  }

  onNewWindowResultPage(fileId: string) {
    //
    const agent = navigator.userAgent.toLowerCase();
    const isIE = agent.indexOf('msie') > -1 || agent.indexOf('trident') > -1;

    if (isIE) {
      alert(AlertModel.getCustomAlert(true, '??????', 'Internet Explorer??? ?????? ????????? ???????????? ????????????.', '??????'));
      return;
    }

    const resultPageURL = process.env.NODE_ENV === 'development' ? `/pdf/${fileId}` : `/manager/pdf/${fileId}`;

    // window.open(resultPageURL, '_blank');
    const uploadURL =
      process.env.NODE_ENV === 'development' ? '/mySUNIResultReport.html' : '/manager/mySUNIResultReport.html';

    window.open(resultPageURL, '_blank');
  }

  render() {
    //
    const { studentService, sharedService, searchBoxService } = this.injected;
    const { cardQuery, cardContentsQuery, cardId } = this.props;
    const {
      students,
      studentQuery,
      selectedIds,
      studentCount,
      changeStudentQueryProps,
      selectedEmails,
      selectedNames,
    } = studentService;

    const { startNo, count } = sharedService.getPageModel(this.paginationKey);
    const paperId =
      cardContentsQuery.tests && cardContentsQuery.tests.length > 0 ? cardContentsQuery.tests[0].paperId : '';
    const isReport = cardContentsQuery.reportFileBox?.report || false;

    const { learningStateCount } = studentCount;

    return (
      <Container fluid>
        <SearchBox
          name={this.paginationKey}
          queryModel={studentQuery}
          changeProps={changeStudentQueryProps}
          onSearch={this.findStudentResult}
        >
          <SearchBox.Group name="????????????">
            <SearchBox.DatePicker
              startFieldName="period.startDateMoment"
              endFieldName="period.endDateMoment"
              searchButtons
            />
          </SearchBox.Group>
          <SearchBox.Group name="Test ?????? ??????">
            <SearchBox.Select
              fieldName="scoringState"
              options={paperId === '' && !isReport ? SelectType.nullState : SelectType.scoringState}
              placeholder="??????"
              onChange={(event, data) => this.onChangeScoringState(data.value)}
            />
            <SearchBox.Select
              name="Test ????????????"
              fieldName="examAttendance"
              options={paperId === '' && !isReport ? SelectType.nullState : SelectType.testFrequency}
              placeholder="??????"
            />
            {/* <>
              <label>????????????</label>
              <div style={{ height: '39px' }}>
                <Form.Field
                  style={{ margin: '8px' }}
                  control={Checkbox}
                  onClick={(e: any, data: any) => searchBoxService.changePropsFn('phaseCompleteState', data.checked)}
                />
              </div>
            </> */}
          </SearchBox.Group>
          <SearchBox.Group name="Survey ????????????">
            <SearchBox.Select fieldName="surveyCompleted" options={SelectType.surveyCompleted} placeholder="??????" />
            <SearchBox.Select
              name="????????????"
              fieldName="learningState"
              options={this.state.learningStateSelect}
              placeholder="??????"
            />
          </SearchBox.Group>
          <SearchBox.Query options={SelectType.searchPartForLearner} searchWordDisabledValues={['', '??????']} />
        </SearchBox>

        <Pagination name={this.paginationKey} onChange={this.findStudentResult}>
          <SubActions>
            <SubActions.Left>
              <SubActions.Count>
                <strong>{studentCount.totalStudentCount}</strong>???<span className="dash">|</span>
                ?????? <strong>{learningStateCount.passedCount}</strong>??? <span className="dash">|</span>
                ????????? <strong>{learningStateCount.missedCount}</strong>???
              </SubActions.Count>
            </SubActions.Left>
            <SubActions.Right>
              <Pagination.LimitSelect allViewable={false} />
              <SubActions.ExcelButton download onClick={this.onClickDownExcel} />
              <SendEmailModal
                onShow={this.checkEmail}
                emailList={selectedEmails}
                nameList={selectedNames}
                idList={selectedIds}
                cardId={cardId}
                cubeName={getPolyglotToAnyString(cardQuery.name)}
                type={SelectType.mailOptions[2].value}
                sendCount={count}
                tooltipText="????????? ???????????? ??????????????? ????????? ????????? ?????? ???????????? ???????????? ?????? ?????????"
                studentQuery={studentQuery}
              />
              <SendSmsModal
                onShow={this.checkSms}
                idList={selectedIds}
                nameList={selectedNames}
                cardId={cardId}
                cubeName={getPolyglotToAnyString(cardQuery.name)}
                type={SelectType.mailOptions[2].value}
                sendCount={count}
                tooltipText="????????? ???????????? SMS????????? ????????? ????????? ?????? ???????????? ???????????? ?????? ?????????"
                studentQuery={studentQuery}
              />
              <Button type="button" onClick={() => this.onNewWindowResultPage(cardId)}>
                ?????? ??????
              </Button>
            </SubActions.Right>
          </SubActions>

          <Loader>
            <CardResultManagementView
              startNo={startNo}
              students={students}
              selectedIds={selectedIds}
              surveyId={cardContentsQuery.surveyId}
              checkAll={this.checkAll}
              checkOne={this.checkOne}
              renderExam={this.renderExam}
              renderReport={this.renderReport}
            />
          </Loader>

          <Grid className="list-info">
            <Grid.Row>
              <Grid.Column width={8}>
                <label style={{ color: '#FF0000' }}>
                  {`* "???????????? : ?????????"??? ?????? ?????? ??????????????? ?????? ???????????? ?????? ????????????, ????????? "???????????? :
                ??????????????????"??? ?????? ??? ?????? ????????? ????????? ?????????`}
                </label>
              </Grid.Column>
              <Grid.Column width={8}>
                <div className="right">
                  <Button type="button" onClick={() => this.onClickModifyStudentsState(LearningState.Passed)}>
                    ??????
                  </Button>
                  <Button type="button" onClick={() => this.onClickModifyStudentsState(LearningState.Missed)}>
                    ?????????
                  </Button>
                  <Button type="button" onClick={() => this.onClickModifyStudentsState(LearningState.NoShow)}>
                    ??????
                  </Button>
                  <Button type="button" onClick={() => this.onClickModifyStudentsState(LearningState.Progress)}>
                    ??????????????????
                  </Button>
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          {/*<SubActions>*/}
          {/*  <SubActions.Left>*/}
          {/*    <label style={{ color: '#FF0000' }}>*/}
          {/*      {`* "???????????? : ?????????"??? ?????? ?????? ??????????????? ?????? ???????????? ?????? ????????????, ????????? "???????????? :*/}
          {/*      ??????????????????"??? ?????? ??? ?????? ????????? ????????? ?????????`}*/}
          {/*    </label>*/}
          {/*  </SubActions.Left>*/}
          {/*  <SubActions.Right>*/}
          {/*    <Button type="button" onClick={() => this.onClickModifyStudentsState(LearningState.Passed)}>*/}
          {/*      ??????*/}
          {/*    </Button>*/}
          {/*    <Button type="button" onClick={() => this.onClickModifyStudentsState(LearningState.Missed)}>*/}
          {/*      ?????????*/}
          {/*    </Button>*/}
          {/*    <Button type="button" onClick={() => this.onClickModifyStudentsState(LearningState.NoShow)}>*/}
          {/*      ??????*/}
          {/*    </Button>*/}
          {/*    <Button type="button" onClick={() => this.onClickModifyStudentsState(LearningState.Progress)}>*/}
          {/*      ??????????????????*/}
          {/*    </Button>*/}
          {/*  </SubActions.Right>*/}
          {/*</SubActions>*/}
          <Pagination.Navigator />
        </Pagination>
        <ResultManagementModalContainer />
      </Container>
    );
  }
}

export default CardResultManagementContainer;
