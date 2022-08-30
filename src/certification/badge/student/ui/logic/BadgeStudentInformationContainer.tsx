import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Button } from 'semantic-ui-react';
import XLSX from 'xlsx';

import { patronInfo } from '@nara.platform/dock';
import { reactAlert, reactAutobind, ReactComponent, reactConfirm } from '@nara.platform/accent';

import { SelectType } from 'shared/model';
import { SharedService } from 'shared/present';
import { Pagination, SearchBox, SubActions } from 'shared/components';
import { getDefaultLanguage, getPolyglotToAnyString } from 'shared/components/Polyglot';
import { SearchBoxService } from 'shared/components/SearchBox';
import { MenuAuthority, ConfirmWin } from 'shared/ui';
import { commonHelper, dateTimeHelper, getAuthorizedContentsUrl, getBadgeDetailUrl } from 'shared/helper';

import { MemberModel } from '_data/approval/members/model';
import { MemberService } from '../../../../../approval';

import { BadgeService } from '../../../../index';
import BadgeStudentService from '../../present/logic/BadgeStudentService';
import { BadgeIssueState } from '../../model/BadgeIssueState';
import { BadgeStudentModel } from '../../model/BadgeStudentModel';
import { BadgeMissionState } from '../../model/BadgeMissionState';
import { BadgeStudentXlsxModel } from '../../model/BadgeStudentXlsxModel';
import { BadgeStudentQueryModel } from '../../model/BadgeStudentQueryModel';
import { BadgeIssueRequestUploadModel } from '../../model/BadgeIssueRequestUploadModel';
import { BadgeIssueStateByEmailUdoModel } from '../../model/BadgeIssueStateByEmailUdoModel';
import { BadgeMissionMailRequestCdoModel } from '../../model/BadgeMissionMailRequestCdoModel';
import { BadgeMissionStateRequestCdoModel } from '../../model/BadgeMissionStateRequestCdoModel';
import BadgeStudentMailTemplateModal from './BadgeStudentMailTemplateModal';
import BadgeExcelReadForIssueModal from './BadgeExcelReadForIssueModal';
import { BadgeOperatorIdName } from '../../model/BadgeOperatorIdName';
import BadgeStudentInformationView from '../view/BadgeStudentInformationView';

enum ConfirmType {
  None = 'None',
  MissionPassed = 'MissionPassed',
  MissionFailed = 'MissionFailed',
  Issue = 'Issue',
  IssueCancel = 'IssueCancel',
}

interface ConfirmProps {
  confirmType: ConfirmType;
  title: string;
  message: string;
}

interface Props {
  badgeId: string;
  totalCardCount: number;
}

interface States {
  selectAll: string;
  selectedStudent: BadgeStudentModel;
  fileName: string;
  excelReadModalWin: boolean;
  confirmWinOpen: boolean;
  confirmProps: ConfirmProps;
}

interface Injected {
  sharedService: SharedService;
  badgeService: BadgeService;
  badgeStudentService: BadgeStudentService;
  memberService: MemberService;
  searchBoxService: SearchBoxService;
}

const EmployedSelectOptions = [
  { key: '1', text: '전체', value: '' },
  { key: '2', text: '재직자', value: 'true' },
  { key: '3', text: '퇴직자', value: 'false' },
];

@inject('sharedService', 'badgeStudentService', 'badgeService', 'memberService', 'searchBoxService')
@observer
@reactAutobind
class BadgeStudentInformationContainer extends ReactComponent<Props, States, Injected> {
  //
  paginationKey = 'badgeStudent';

  constructor(props: Props) {
    //
    super(props);
    this.state = {
      selectAll: 'No',
      selectedStudent: new BadgeStudentModel(),
      fileName: '',
      confirmWinOpen: false,
      confirmProps: {
        confirmType: ConfirmType.None,
        title: '',
        message: '',
      },
      excelReadModalWin: false,
    };

    const { badgeId } = this.props;
    const { changeStudentQueryProps } = this.injected.badgeStudentService;

    changeStudentQueryProps('badgeId', badgeId);
  }

  componentDidMount() {
    //
    this.init();
  }

  async init() {
    //
    const { badgeStudentService } = this.injected;
    const { changeSelectedStudentProps, changeSelectedIssueStateProps } = badgeStudentService!;

    changeSelectedStudentProps([]);
    changeSelectedIssueStateProps([]);
    this.setState({ selectAll: 'No' });
  }

  async findStudentsBySearch() {
    //
    const { badgeService, sharedService, badgeStudentService } = this.injected;
    const { badge } = badgeService;

    const pageModel = sharedService.getPageModel(this.paginationKey);
    await badgeStudentService.findAllStudents(pageModel);
    await badgeStudentService.findStudentCountByBadgeId(badge.id);

    sharedService.setCount('badgeStudent', badgeStudentService.students ? badgeStudentService.students.totalCount : 0);
  }

  handleChangeStudentQueryProp(name: string, value: any) {
    //
    const { badgeStudentService } = this.injected;
    badgeStudentService!.changeStudentQueryProps(name, value);
  }

  handleSearchBySearchBox() {
    //
    const { badgeStudentService } = this.injected;
    if (badgeStudentService) {
      const queryValidationResult = BadgeStudentQueryModel.isBlank(badgeStudentService.studentQuery);
      if (queryValidationResult === 'success') {
        this.findStudentsBySearch();
      } else {
        reactAlert({ title: '안내', message: '검색어를 입력해주세요.' });
      }
    }
  }

  async handleDownExcel() {
    //
    const { badgeStudentService, badgeService } = this.injected;
    const { badge } = badgeService;

    //
    await badgeStudentService!.findAllStudentsForExcel();
    const { studentsExcelWrite } = badgeStudentService;

    const wbList: BadgeStudentXlsxModel[] = [];
    studentsExcelWrite?.forEach((student) => {
      wbList.push(BadgeStudentModel.asXLSX(student, this.props.totalCardCount));
    });

    const studentExcel = XLSX.utils.json_to_sheet(wbList);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, studentExcel, 'Badge_Students');

    const name = getPolyglotToAnyString(badge.name, getDefaultLanguage(badge.langSupports));
    const date = dateTimeHelper.dateToExcelFileNameFormat(new Date());
    const time = new Date().toLocaleTimeString('en-GB');
    const fileName = `${name}.${date}:${time}.xlsx`;
    XLSX.writeFile(wb, fileName, { compression: true });
    return fileName;
  }

  handleReadUploadExcelModalOpen() {
    const { excelReadModalWin } = this.state;
    this.setState({ excelReadModalWin: !excelReadModalWin });
  }

  uploadFile(file: File) {
    //
    const { badgeService, badgeStudentService } = this.injected;
    const { badge } = badgeService!;

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
      let students: BadgeIssueRequestUploadModel[] = [];

      workbook.SheetNames.forEach((item: any) => {
        const jsonArray = XLSX.utils.sheet_to_json<BadgeIssueRequestUploadModel>(workbook.Sheets[item]);
        if (jsonArray.length === 0) {
          return;
        }
        students = jsonArray;
      });

      const udo = new BadgeIssueStateByEmailUdoModel({
        badgeId: badge.id,
        emails: students.map((student) => student.email),
        issueState: BadgeIssueState.Requested,
      } as BadgeIssueStateByEmailUdoModel);
      badgeStudentService!.setBadgeIssueStateUdoByEmail(udo);
    };
    fileReader.readAsArrayBuffer(file);
  }

  async onReadUploadExcel() {
    //
    const { badgeStudentService } = this.injected;
    const { badgeIssueStateUdoByEmail } = badgeStudentService!;

    if (!badgeIssueStateUdoByEmail.emails.length) {
      reactAlert({
        title: '알림',
        message: '발급할 대상이 존재하지 않습니다.',
      });
    }

    await badgeStudentService!.excelRead(badgeIssueStateUdoByEmail).then((excelReadCount) => {
      this.setState({
        excelReadModalWin: false,
      });

      reactAlert({
        title: '알림',
        message: `총 ${excelReadCount.studentsCount}명  중,  ${excelReadCount.successCount}명이 발급되었습니다.`,
      });

      this.init();
    });
    await this.findStudentsBySearch();
  }

  onChangePagingLimit(limit: string) {
    //
    const { badgeStudentService } = this.injected;
    badgeStudentService!.changeStudentQueryProps('limit', limit);
    this.findStudentsBySearch();
  }

  checkOne(student: BadgeStudentModel) {
    //
    const studentId = student.id;
    const issueState = student.badgeIssueState;
    const { selectedList, issueStateList, changeSelectedStudentProps, changeSelectedIssueStateProps } =
      this.injected.badgeStudentService;
    const copiedSelectedList: string[] = [...selectedList];
    const copiedIssueStateList: string[] = [...issueStateList];
    const index = copiedSelectedList.indexOf(studentId);
    if (index >= 0) {
      const newSelectedList = copiedSelectedList.slice(0, index).concat(copiedSelectedList.slice(index + 1));

      const newIssueStateList = copiedIssueStateList.slice(0, index).concat(copiedIssueStateList.slice(index + 1));

      changeSelectedStudentProps(newSelectedList);
      changeSelectedIssueStateProps(newIssueStateList);
    } else {
      copiedSelectedList.push(studentId);
      copiedIssueStateList.push(issueState);
      changeSelectedStudentProps(copiedSelectedList);
      changeSelectedIssueStateProps(copiedIssueStateList);
    }
  }

  checkAll(checkAll: string) {
    //
    const isChecked = checkAll === 'Yes';
    const { badgeStudentService } = this.injected;
    const { students, changeSelectedStudentProps, changeSelectedIssueStateProps } = badgeStudentService!;

    const employedStudents = students.results.filter((student) => student.studentInfo?.id);

    if (isChecked || employedStudents.length === 0) {
      changeSelectedStudentProps([]);
      changeSelectedIssueStateProps([]);
      this.setState({ selectAll: 'No' });
    } else {
      const allList = employedStudents.map((student) => student.id);
      const allIssueState = employedStudents.map((student) => student.badgeIssueState);
      changeSelectedStudentProps(allList);
      changeSelectedIssueStateProps(allIssueState);
      this.setState({ selectAll: 'Yes' });
    }
  }

  handleMissionMailModalOpen(open: boolean, target?: BadgeStudentModel) {
    const { changeMissionMailModalOpen } = this.injected.badgeStudentService!;

    if (open && target) {
      this.setState({ selectedStudent: target }, () => changeMissionMailModalOpen(true));
    } else {
      changeMissionMailModalOpen(false);
    }
  }

  async handleMissionMailModalOk(requestCdo: BadgeMissionMailRequestCdoModel) {
    const { changeMissionMailModalOpen, studentMissionMailRequest, findStudent, changeStudentsRow, setStudentInfo } =
      this.injected.badgeStudentService!;
    const { badge } = this.injected.badgeService!;
    const { memberService } = this.injected;

    changeMissionMailModalOpen(false);

    requestCdo.badgeName = badge.name;
    requestCdo.url = getAuthorizedContentsUrl(getBadgeDetailUrl(badge.id));
    studentMissionMailRequest(requestCdo)
      .then(() => {
        findStudent(requestCdo.badgeStudentId).then((student) => {
          memberService.findMemberById(student.patronKey.keyString).then((studentInfo) => {
            const student = setStudentInfo(studentInfo);
            changeStudentsRow(student);
          });
        });
      })
      .catch(() => {
        reactAlert({ title: '안내', message: '메일 발송이 실패했습니다.' });
      });
  }

  cofirmMissionPassed(completed: boolean, target: BadgeStudentModel) {
    const confirmType = completed ? ConfirmType.MissionPassed : ConfirmType.MissionFailed;
    this.setState({ selectedStudent: new BadgeStudentModel(target) }, () => this.handleConfirmOpen(confirmType));
  }

  handleConfirmOpen(confirmType: ConfirmType) {
    const { confirmProps } = this.state;
    let title = '확인';
    let message = '';
    if (confirmType === ConfirmType.MissionPassed) {
      title = '미션 성공 저장';
      message = '미션 성공을 저장하시겠습니까?';
    } else if (confirmType === ConfirmType.MissionFailed) {
      title = '미션 실패 저장';
      message = '미션 실패를 저장하시겠습니까?';
    } else if (confirmType === ConfirmType.Issue || confirmType === ConfirmType.IssueCancel) {
      const { selectedList } = this.injected.badgeStudentService!;
      if (selectedList.length < 1) {
        reactAlert({ title: '안내', message: '대상자를 선택하세요.' });
        return;
      }
      if (confirmType === ConfirmType.Issue) {
        title = 'Badge 일괄 발급';
        message = '해당 학습자에게 Badge를 발급하시겠습니까?';
      } else {
        title = 'Badge 일괄 취소';
        message = '해당 학습자의 Badge 발급을 취소하시겠습니까?';
      }
    }

    const newConfirmProps = {
      ...confirmProps,
      confirmType,
      title,
      message,
    };

    this.setState({ confirmProps: newConfirmProps, confirmWinOpen: true });
  }

  handleConfirmYes() {
    //
    const { confirmProps } = this.state;
    const { confirmType } = confirmProps;

    if (confirmType === 'MissionPassed' || confirmType === 'MissionFailed') {
      const missionCompleted = confirmType === ConfirmType.MissionPassed;
      this.handleMissionPassed(missionCompleted);
    } else if (confirmType === 'Issue' || confirmType === 'IssueCancel') {
      const issueState = confirmType === ConfirmType.Issue ? BadgeIssueState.Issued : BadgeIssueState.Canceled;
      this.handleModifyIssueState(issueState);
    }

    this.setState({ confirmWinOpen: false });
  }

  handleConfirmNo() {
    this.setState({ confirmWinOpen: false });
  }

  handleMissionPassed(passed: boolean) {
    //
    const { findStudent, changeStudentsRow, setStudentInfo, studentMissionRequest } =
      this.injected.badgeStudentService!;
    const { selectedStudent } = this.state;
    const { memberService } = this.injected;

    const cdo = new BadgeMissionStateRequestCdoModel({
      badgeStudentId: selectedStudent!.id,
    } as BadgeMissionStateRequestCdoModel);

    studentMissionRequest(cdo, passed)
      .then(() => {
        findStudent(cdo.badgeStudentId).then((studentInfo) => {
          memberService.findMemberById(studentInfo.patronKey.keyString).then((studentInfo) => {
            const student = setStudentInfo(studentInfo);
            changeStudentsRow(student);
          });
        });
      })
      .catch(() => {
        reactAlert({
          title: '알림',
          message: '저장이 실패했습니다.',
        });
      });
  }

  async handleModifyIssueState(issueState: BadgeIssueState) {
    //
    const { changeSelectedStudentProps } = this.injected.badgeStudentService!;

    const operator = new BadgeOperatorIdName();
    operator.operatorName = patronInfo.getPatronName() || '';

    if (issueState === BadgeIssueState.Issued) {
      //
      const { issuedBadgeIssueState } = this.injected.badgeStudentService;

      await issuedBadgeIssueState();
    } else {
      //
      const { canceledBadgeIssueState } = this.injected.badgeStudentService;

      await canceledBadgeIssueState();
    }

    changeSelectedStudentProps([]);
    await this.findStudentsBySearch();
  }

  renderAdditionMailView(student: BadgeStudentModel): React.ReactNode {
    // 뱃지:수동발급건/추가발급조건 & 수강정보:메일발송여부/발급상태
    const { badge } = this.injected.badgeService!;
    const isNotMailTarget: boolean =
      badge.additionalRequirementsNeeded === undefined
        ? false
        : !badge.additionalRequirementsNeeded || badge.issueAutomatically || student.badgeIssueState === null;

    if (isNotMailTarget) {
      return '-';
    }
    return (
      <Button onClick={() => this.handleMissionMailModalOpen(true, student)}>
        {student.additionalRequirementsMailSentTime > 0 ? '재발송' : '발송'}
      </Button>
    );
  }

  renderMissionStateView(student: BadgeStudentModel): React.ReactNode {
    // 뱃지:수동발급건/추가발급조건 & 수강정보:메일발송여부/추가미션수행여부
    const { badge } = this.injected.badgeService!;
    const isNotMissionPassedTarget: boolean =
      badge.issueAutomatically ||
      !badge.additionalRequirementsNeeded ||
      // !student.additionTermsMailSent ||
      !student.additionalRequirementsMailSentTime ||
      student.badgeIssueState === null;
    if (isNotMissionPassedTarget) return '-';
    // 발급상태가 결정된 이후는 미션수행여부 표시
    if (student.additionalRequirementsMailSentTime > 0 && student.additionalRequirementsPassed !== null) {
      // if (student.missionState !== BadgeMissionState.None) {
      //   return student.missionState;
      return student.additionalRequirementsPassed ? BadgeMissionState.Passed : BadgeMissionState.Failed;
    }
    return (
      <>
        <Button onClick={() => this.cofirmMissionPassed(true, student)} primary>
          Pass
        </Button>
        | <Button onClick={() => this.cofirmMissionPassed(false, student)}>Fail</Button>
      </>
    );
  }

  handleCancelChallenge() {
    const { badge } = this.injected.badgeService!;
    reactConfirm({
      title: '',
      message: `<b>${badge.name}</b> Badge 에서 사용자를 삭제하시겠습니까?`,
      onOk: () => this.deleteUserBadge(),
    });
  }

  async deleteUserBadge() {
    //
    const { badgeStudentService } = this.injected;
    await badgeStudentService.deleteUserBadge();

    this.init();
    await this.findStudentsBySearch();
  }

  componentWillUnmount(): void {
    //
    const { badgeStudentService, sharedService } = this.injected;
    badgeStudentService!.clearQuery();
    sharedService.init(this.paginationKey, 0, 20);
  }

  render() {
    const { badgeService, badgeStudentService, searchBoxService } = this.injected;
    const { missionMailModalOpen: mailTemplateModalOpen } = badgeStudentService!;
    const { badge, badgeOperatorIdentity } = badgeService!;
    const { selectedList, students, studentsForModify, studentCount, studentQuery } = badgeStudentService;
    const { selectAll, fileName, excelReadModalWin, confirmWinOpen, confirmProps } = this.state;
    // SK University 의 SuperManager 권한 체크
    const skUniRole = commonHelper.getSkUniSuperRole();
    const searchWordDisabledKey = 'searchPart';
    const searchWordDisabledKeyWord = searchBoxService.searchBoxQueryModel[searchWordDisabledKey];

    return (
      <>
        <SearchBox
          onSearch={this.handleSearchBySearchBox}
          changeProps={this.handleChangeStudentQueryProp}
          queryModel={studentQuery}
          name={this.paginationKey}
        >
          <SearchBox.Group name="신청일자">
            <SearchBox.DatePicker
              startFieldName="period.startDateMoment"
              endFieldName="period.endDateMoment"
              searchButtons
            />
          </SearchBox.Group>
          <SearchBox.Group>
            <SearchBox.Select
              name="Badge 획득여부"
              placeholder="전체"
              fieldName="badgeIssueState"
              options={SelectType.badgeStudentIssued}
            />
            <SearchBox.Select
              name="Badge 도전취소여부"
              placeholder="전체"
              fieldName="badgeStudentState"
              options={SelectType.badgeCanceled}
            />
            <SearchBox.Select
              name="재직자 여부"
              placeholder="전체"
              fieldName="employed"
              options={EmployedSelectOptions}
            />
          </SearchBox.Group>
          <SearchBox.Group name="검색어">
            <SearchBox.Select fieldName="searchPart" options={SelectType.searchPartForLearner} placeholder="전체" />
            <SearchBox.Input
              fieldName="searchWord"
              placeholder="검색어를 입력해주세요."
              disabled={searchWordDisabledKeyWord === '' || searchWordDisabledKeyWord === '전체'}
            />
          </SearchBox.Group>
        </SearchBox>

        <Pagination name={this.paginationKey} onChange={this.findStudentsBySearch}>
          <SubActions>
            <SubActions.Left>
              {students && (
                <span>
                  전체 <strong>{studentCount.totalCount}</strong>명 학습자
                  <span className="dash">|</span>
                  Badge 획득자
                  <strong>{studentCount.issuedCount}</strong>명 <span className="dash">|</span>
                  발급요청 <strong>{studentCount.requestedCount}</strong>명<span className="dash">|</span>
                  발급요청취소 <strong>{studentCount.requestCanceledCount}</strong>명<span className="dash">|</span>
                  발급취소 <strong>{studentCount.canceledCount}</strong>명<span className="dash">|</span>
                  도전중 <strong>{studentCount.challengingCount}</strong>명<span className="dash">|</span>
                  도전취소 <strong>{studentCount.challengeCancelCount}</strong>명
                </span>
              )}
            </SubActions.Left>
            <SubActions.Right>
              <Pagination.LimitSelect allViewable />
              <SubActions.ExcelButton download onClick={this.handleDownExcel} />
              <Button onClick={this.handleReadUploadExcelModalOpen}>일괄도전 등록(엑셀업로드)</Button>
            </SubActions.Right>
          </SubActions>

          <BadgeStudentInformationView
            selectAll={selectAll}
            checkAll={this.checkAll}
            checkOne={this.checkOne}
            renderAdditionMailView={this.renderAdditionMailView}
            renderMissionStateView={this.renderMissionStateView}
            selectedList={selectedList}
            students={studentsForModify}
            totalCardCount={this.props.totalCardCount}
          />

          <SubActions>
            <SubActions.Right>
              <MenuAuthority permissionAuth={{ isSuperManager: true }}>
                <Button onClick={() => this.handleCancelChallenge()} type="button" disabled={selectedList.length <= 0}>
                  도전대상자삭제
                </Button>
              </MenuAuthority>
              <Button
                onClick={() => this.handleConfirmOpen(ConfirmType.Issue)}
                type="button"
                disabled={badge.issueAutomatically}
              >
                일괄발급
              </Button>
              <Button
                onClick={() => this.handleConfirmOpen(ConfirmType.IssueCancel)}
                type="button"
                disabled={badge.issueAutomatically}
              >
                일괄취소
              </Button>
            </SubActions.Right>
          </SubActions>
          <Pagination.Navigator />
        </Pagination>

        <ConfirmWin
          open={confirmWinOpen}
          title={confirmProps.title}
          message={confirmProps.message}
          buttonYesName="OK"
          buttonNoName="Cancel"
          handleOk={this.handleConfirmYes}
          handleClose={this.handleConfirmNo}
        />
        <BadgeStudentMailTemplateModal
          open={mailTemplateModalOpen}
          onClose={() => this.handleMissionMailModalOpen(false)}
          onSend={this.handleMissionMailModalOk}
          badge={badge}
          student={this.state.selectedStudent}
          badgeOperatorInfo={badgeOperatorIdentity}
        />
        <BadgeExcelReadForIssueModal
          open={excelReadModalWin}
          onChangeOpen={this.handleReadUploadExcelModalOpen}
          fileName={fileName}
          uploadFile={this.uploadFile}
          onReadExcel={this.onReadUploadExcel}
        />
      </>
    );
  }
}

export default BadgeStudentInformationContainer;
