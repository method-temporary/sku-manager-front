import React from 'react';
import _ from 'lodash';
import { inject, observer } from 'mobx-react';
import { Button, Container } from 'semantic-ui-react';
import moment from 'moment';
import XLSX from 'xlsx';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectType, SelectTypeModel } from 'shared/model';
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
import { LoaderService } from 'shared/components/Loader';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';
import { SearchBoxService } from 'shared/components/SearchBox';

import StudentDeleteResultModel from 'student/model/StudentDeleteResultModel';
import { StudentModel } from 'student/model/StudentModel';
import { StudentXlsxModel } from 'student/model/StudentXlsxModel';
import { UserService } from 'user';

import { MemberService } from '../../../../approval';
import { removeInList } from '../../../../lecture/student/ui/logic/StudentHelper';
import { StudentService } from '../../../../student';
import { StudentWithUserIdentity } from '../../../../student/model/StudentWithUserIdentity';
import { CardQueryModel } from '../../../card';
import { CardContentsQueryModel } from '../../../card/model/CardContentsQueryModel';
import { LearningContentType } from '../../../card/model/vo/LearningContentType';
import CardStudentInformationView from '../view/CardStudentInformationView';
import CardStudentRemoveResultModal from './CardStudentRemoveResultModal';
import CardStudentUploadResultListModal from './CardStudentUploadResultListModal';
import ExcelReadModal from './ExcelReadModal';

interface Props {
  cardId: string;
  cardQuery: CardQueryModel;
  cardContentsQuery: CardContentsQueryModel;
}

interface state {
  isOpenExcelReadModal: boolean;
  isOpenExcelReadFailedListModal: boolean;
  isOpenRemoveStudentResultModal: boolean;
  fileName: string;
  resultText: string;
  joinCubeStudents: StudentDeleteResultModel[];
}

interface Injected {
  sharedService: SharedService;
  studentService: StudentService;
  memberService: MemberService;
  searchBoxService: SearchBoxService;
  userService: UserService;
  sendSmsService: SendSmsService;
  loaderService: LoaderService;
}

@inject(
  'sharedService',
  'studentService',
  'memberService',
  'searchBoxService',
  'userService',
  'sendSmsService',
  'loaderService'
)
@observer
@reactAutobind
class CardStudentInformationContainer extends ReactComponent<Props, state, Injected> {
  //
  paginationKey = 'cardStudent';

  constructor(props: Props) {
    super(props);
    this.state = {
      isOpenExcelReadModal: false,
      isOpenExcelReadFailedListModal: false,
      isOpenRemoveStudentResultModal: false,
      fileName: '',
      resultText: '',
      joinCubeStudents: [],
    };

    const { clearQuery, clearSelected, changeStudentQueryProps, clearExcelUpload } = this.injected.studentService;
    const cardId = this.props;

    clearQuery();
    clearSelected();
    clearExcelUpload();
    changeStudentQueryProps('cardId', cardId);
  }

  componentDidMount() {
    //
    const { userService, sendSmsService } = this.injected;
    userService.findUser(); // 용자 폰번호 조회용
    // 권한 체크
    sendSmsService.findMySmsSenderAllowed();
  }

  clearExcelUpload() {
    const { clearExcelUpload } = this.injected.studentService;
    clearExcelUpload();

    this.setState({
      isOpenExcelReadModal: false,
      isOpenExcelReadFailedListModal: false,
      fileName: '',
      resultText: '',
    });
  }

  async findStudents() {
    //
    const { cardId } = this.props;
    const { studentService, sharedService } = this.injected;
    const pageModel = this.injected.sharedService.getPageModel(this.paginationKey);

    studentService.changeStudentQueryProps('cardId', cardId);

    const totalCount = await studentService.findCardStudents(pageModel, 'studentInfo');

    // await setStudentInfo(studentService.students, studentService, memberService);

    sharedService.setCount(this.paginationKey, totalCount);
  }

  onChangeStudentQueryProp(name: string, value: any) {
    //
    const { studentService } = this.injected;
    studentService.changeStudentQueryProps(name, value);
  }

  async onClickDownExcel() {
    //
    const { cardId } = this.props;
    const { cardQuery } = this.props;
    const { studentService } = this.injected;

    studentService.changeStudentQueryProps('cardId', cardId);

    const { findAllCardStudents } = studentService;
    const students = await findAllCardStudents();

    const wbList: StudentXlsxModel[] = [];

    students?.forEach((student) => {
      wbList.push(StudentModel.asXLSXForCard(student));
    });

    const studentExcel = XLSX.utils.json_to_sheet(wbList);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, studentExcel, 'Students');

    const name = getPolyglotToAnyString(cardQuery.name);
    const date = moment().format('YYYY-MM-DD_HH:mm:ss');
    const fileName = `${name}.${date}.xlsx`;
    XLSX.writeFile(wb, fileName, { compression: true });
    return fileName;
  }

  onChangeOpenExcelUpload() {
    const { isOpenExcelReadModal } = this.state;
    this.clearExcelUpload();
    this.setState({ isOpenExcelReadModal: !isOpenExcelReadModal, isOpenExcelReadFailedListModal: false });
  }

  onClickOpenExcelUploadFailedList() {
    this.setState({ isOpenExcelReadModal: false, isOpenExcelReadFailedListModal: true });
  }

  onCloseModal() {
    //
    this.setState({
      isOpenExcelReadFailedListModal: false,
      isOpenExcelReadModal: false,
      isOpenRemoveStudentResultModal: false,
    });
  }

  uploadFile(file: File) {
    //
    const { studentService } = this.injected;

    const fileReader = new FileReader();

    fileReader.onload = (e: any) => {
      let binary = '';
      let readList: any[] = [];
      const data = new Uint8Array(e.target.result);
      const length = data.byteLength;
      for (let i = 0; i < length; i++) {
        binary += String.fromCharCode(data[i]);
      }
      const workbook: any = XLSX.read(binary, { type: 'binary' });

      workbook.SheetNames.forEach((item: any) => {
        const jsonArray = XLSX.utils.sheet_to_json(workbook.Sheets[item]);
        if (jsonArray.length === 0) {
          return;
        }
        readList = jsonArray;
        readList = readList.map((data) => data.email);
      });

      studentService.excelUpload(readList);
      this.setState({ fileName: file.name });
    };

    fileReader.readAsArrayBuffer(file);
  }

  async onReadExcel() {
    //
    const { studentService, loaderService } = this.injected;
    const { excelUploadEmailList } = studentService;
    loaderService.openPageLoader(true);

    const targetCardId = this.props.cardId;

    await studentService
      .registerCardStudents(targetCardId)
      .then((failedList) => {
        const resultText = `총 ${excelUploadEmailList.length}건 중 ${
          excelUploadEmailList.length - (failedList && failedList.length)
        }건 성공 / ${failedList && failedList.length}건 실패`;

        this.setState({ resultText });
      })
      .finally(() => {
        this.findStudents();
        loaderService.closeLoader(true);
      });

    this.onClickOpenExcelUploadFailedList();
  }

  addCompletePhaseList() {
    //
    const { learningContents } = this.props.cardContentsQuery;
    const list: SelectTypeModel[] = [new SelectTypeModel()];
    learningContents?.forEach((content) => {
      if (content.learningContentType === LearningContentType.Chapter) {
        content.children?.forEach((cContent) => {
          list.push(
            new SelectTypeModel(
              cContent.contentId,
              `${getPolyglotToAnyString(content.name)} > ${getPolyglotToAnyString(cContent.name)}`,
              cContent.contentId
            )
          );
        });
      } else if (content.learningContentType === LearningContentType.Cube) {
        list.push(new SelectTypeModel(content.contentId, getPolyglotToAnyString(content.name), content.contentId));
      }
    });

    return list;
  }

  checkOne(studentWiths: StudentWithUserIdentity) {
    //
    const { student, userIdentity } = studentWiths;

    const studentId = student && student.id;
    const proposalState = student && student.proposalState;
    const {
      selectedIds,
      proposalStates,
      selectedEmails,
      selectedNames,
      selectedUserIds,
      changeSelectedStudentIds,
      changeSelectedProposalStates,
      changeSelectedStudentEmails,
      changeSelectedStudentNames,
      changeSelectedStudentUserIds,
    } = this.injected.studentService;

    const tempList: string[] = [...selectedIds];
    const tempList1: string[] = [...proposalStates];
    if (tempList.indexOf(studentId) !== -1) {
      const newTempStudentList = removeInList(tempList.indexOf(studentId), tempList);
      const newTempProposalStateList = removeInList(tempList.indexOf(studentId), tempList1);

      changeSelectedStudentIds(newTempStudentList);
      changeSelectedProposalStates(newTempProposalStateList);
    } else {
      tempList.push(studentId);
      tempList1.push(proposalState);

      changeSelectedStudentIds(tempList);
      changeSelectedProposalStates(tempList1);
    }

    // 선택한 학습자 메일 목록 by gon 20210222
    const copiedSelectedEmailList: string[] = [...selectedEmails];
    const copiedSelectedNameList: string[] = [...selectedNames];
    const copiedSelectedUserIdList: string[] = [...selectedUserIds];
    const index = copiedSelectedUserIdList.indexOf(student.id);
    // email의 경우 없는 경우가 있음
    const emailIndex = copiedSelectedEmailList.indexOf(student.email);

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

  checkAll(check: boolean) {
    // 선택한 학습자 메일 목록 by gon 20210222
    const { studentService } = this.injected;
    const {
      students,
      changeSelectedStudentIds,
      changeSelectedProposalStates,
      changeSelectedStudentEmails,
      changeSelectedStudentNames,
      changeSelectedStudentUserIds,
    } = studentService;

    const allList: string[] = [];
    const allProposalState: string[] = [];
    const allEmailList: string[] = [];
    const allNameList: string[] = [];
    const allUserIdList: string[] = [];

    if (check) {
      students.forEach((studentWiths) => {
        allList.push(studentWiths.student.id);
        allProposalState.push(studentWiths.student.proposalState);
        allEmailList.push(studentWiths.userIdentity.email);
        allNameList.push(studentWiths.student.name);
        allUserIdList.push(studentWiths.userIdentity.id);
      });

      changeSelectedStudentIds(allList);
      changeSelectedProposalStates(allProposalState);
      changeSelectedStudentEmails(allEmailList);
      changeSelectedStudentNames(allNameList);
      changeSelectedStudentUserIds(allUserIdList);
    } else {
      changeSelectedStudentIds([]);
      changeSelectedProposalStates([]);
      changeSelectedStudentEmails([]);
      changeSelectedStudentNames([]);
      changeSelectedStudentUserIds([]);
    }
  }

  checkEmail() {
    //
    // const { studentService } = this.injected;
    // if (studentService.selectedEmails.length === 0) {
    //   alert(AlertModel.getCustomAlert(false, '안내', '학습자를 선택하세요', '확인'));
    //   return false;
    // } else {
    //   return true;
    // }
    const { sharedService } = this.injected;
    const { count } = sharedService.getPageModel(this.paginationKey);
    if (count <= 0) {
      alert(AlertModel.getCustomAlert(false, '안내', '학습자가 없습니다', '확인'));
      return false;
    }
    return true;
  }

  checkSms() {
    // 권한 체크
    // "SMS 발송 권한이 없으므로 Help Desk(02-6323-9002)로 문의 주시기 바랍니다"
    const { sharedService } = this.injected;
    const { count } = sharedService.getPageModel(this.paginationKey);
    if (count <= 0) {
      alert(AlertModel.getCustomAlert(false, '안내', '학습자가 없습니다', '확인'));
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
          '안내',
          'SMS 발송 권한이 없으므로 Help Desk(02-6323-9002)로 문의 주시기 바랍니다',
          '확인'
        )
      );
      return false;
    }
  }

  async handleDelete() {
    //
    const { studentService } = this.injected;
    const { selectedIds, clearSelected } = studentService;

    confirm(
      ConfirmModel.getRemoveConfirm(async () => {
        const result = await studentService.removeStudentInCard(selectedIds);
        let failedCount = 0;
        if (result) {
          failedCount = _.uniqBy(result, 'id').length;
          this.setState({ joinCubeStudents: result });
        }

        const resultText = `총 ${selectedIds.length}명 중 ${
          selectedIds.length - failedCount
        }명 삭제 성공 / ${failedCount}명 삭제 실패`;

        await this.setState({
          resultText,
          isOpenRemoveStudentResultModal: true,
        });

        clearSelected();
        this.findStudents();
      }),
      true
    );
  }

  render() {
    //
    const { studentService, sharedService } = this.injected;
    const { cardQuery, cardId } = this.props;
    const {
      isOpenExcelReadModal,
      isOpenExcelReadFailedListModal,
      isOpenRemoveStudentResultModal,
      joinCubeStudents,
      fileName,
      resultText,
    } = this.state;
    const { studentQuery, students, selectedEmails, selectedNames, selectedIds, uploadFailedEmailList } =
      studentService;
    const { count, startNo } = sharedService.getPageModel(this.paginationKey);
    const completePhaseList: any = this.addCompletePhaseList();

    return (
      <Container fluid>
        <SearchBox
          name={this.paginationKey}
          queryModel={studentQuery}
          changeProps={this.onChangeStudentQueryProp}
          onSearch={this.findStudents}
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
              name="완료 Phase"
              fieldName="childLecture"
              options={completePhaseList}
              placeholder="전체"
            />
            <SearchBox.Select
              name="이수상태"
              fieldName="learningState"
              options={SelectType.scoringLearningState}
              placeholder="전체"
            />
          </SearchBox.Group>
          <SearchBox.Query options={SelectType.searchPartForLearner} searchWordDisabledValues={['', '전체']} />
        </SearchBox>

        <Pagination name={this.paginationKey} onChange={this.findStudents}>
          <SubActions>
            <SubActions.Left>
              <SubActions.Count number={count} text="명 수강 중" />
            </SubActions.Left>
            <SubActions.Right>
              <Pagination.LimitSelect allViewable={false} />
              <SubActions.ExcelButton download onClick={this.onClickDownExcel} />
              <Button type="button" className="button" onClick={this.onChangeOpenExcelUpload}>
                엑셀 일괄 업로드
              </Button>
              <SendEmailModal
                onShow={this.checkEmail}
                emailList={selectedEmails}
                nameList={selectedNames}
                idList={selectedIds}
                cardId={cardId}
                cubeName={getPolyglotToAnyString(cardQuery.name)}
                type={SelectType.mailOptions[2].value}
                sendCount={count}
                tooltipText="학습자 선택없이 메일보내기 클릭시 검색된 전체 학습자가 수신자로 지정 됩니다"
                studentQuery={studentQuery}
                cardConfigType="studentInfo"
              />
              <SendSmsModal
                onShow={this.checkSms}
                idList={selectedIds}
                nameList={selectedNames}
                cardId={cardId}
                cubeName={getPolyglotToAnyString(cardQuery.name)}
                type={SelectType.mailOptions[2].value}
                sendCount={count}
                tooltipText="학습자 선택없이 SMS보내기 클릭시 검색된 전체 학습자가 수신자로 지정 됩니다"
                studentQuery={studentQuery}
                cardConfigType="studentInfo"
              />

              <Button type="button" className="button" onClick={this.handleDelete}>
                삭제
              </Button>
            </SubActions.Right>
          </SubActions>

          <Loader>
            <CardStudentInformationView
              startNo={startNo}
              students={students}
              selectedIds={selectedIds}
              checkOne={this.checkOne}
              checkAll={this.checkAll}
            />
          </Loader>
          <Pagination.Navigator />
        </Pagination>

        <CardStudentUploadResultListModal
          open={isOpenExcelReadFailedListModal}
          text={resultText}
          failedEmailList={uploadFailedEmailList}
          onClosed={this.onCloseModal}
        />

        <CardStudentRemoveResultModal
          open={isOpenRemoveStudentResultModal}
          text={resultText}
          failedStudentList={joinCubeStudents}
          onClosed={this.onCloseModal}
        />

        <ExcelReadModal
          open={isOpenExcelReadModal}
          fileName={fileName}
          onChangeOpen={this.onChangeOpenExcelUpload}
          uploadFile={this.uploadFile}
          onReadExcel={this.onReadExcel}
          targetText="엑셀 파일을 업로드하면 Card 및 하위 Cube에 학습자가 추가됩니다."
        />
      </Container>
    );
  }
}

export default CardStudentInformationContainer;
