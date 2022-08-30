import React from 'react';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Button, Container, Grid, Icon, Table, List } from 'semantic-ui-react';
import XLSX, { WorkBook } from 'xlsx';
import moment from 'moment';

import { mobxHelper, reactAutobind } from '@nara.platform/accent';

import { AlertWin } from 'shared/ui';

import { baseUrl } from '../../../../Routes';
import MemberTempProcService from '../../mobx/MemberTempProcService';
import { MemberTempCdoModel } from '../../model/MemberTempCdoModel';
import { MemberTempExcelModel } from '../../model/MemberTempExcelModel';
import { AppliedResult } from '../../../../lecture/learningState/model/AppliedResult';

interface Props extends RouteComponentProps<{ cineroomId: string }> {
  memberTempProcService?: MemberTempProcService;
  communityId: string;
}

interface State {
  alertWinOpen: boolean;
  alertIcon: string;
  alertTitle: string;
  alertType: string;
  alertMessage: any;
}

@inject(mobxHelper.injectFrom('memberTempProcService'))
@observer
@reactAutobind
class MemberTempProcContainer extends React.Component<Props, State> {
  //
  private fileInputRef = React.createRef<HTMLInputElement>();

  constructor(props: Props) {
    super(props);

    this.state = {
      alertWinOpen: false,
      alertIcon: '',
      alertTitle: '',
      alertType: '',
      alertMessage: '',
    };
  }

  componentDidMount(): void {
    const { memberTempProcService } = this.props;
    const { clearDisplay, changeFileName } = memberTempProcService!;
    clearDisplay();
    changeFileName('');
  }

  handleCloseAlertWin() {
    //
    this.setState({
      alertWinOpen: false,
    });
  }

  handleOkAlertWin() {
    this.setState({
      alertWinOpen: false,
    });
  }

  uploadFile(file: File) {
    //
    const { memberTempProcService } = this.props;
    const { changeFileName, setIsProcessed, clearDisplay, setExcelDataRowCount } = memberTempProcService!;

    // console.log('file:::111', file);
    const fileReader = new FileReader();

    fileReader.onload = (e: any) => {
      //엑셀 파일 불러오기시 기존 데이터 처리 표기 부분 초기화(그리드 포함)
      clearDisplay();

      let binary: string = '';
      const data = new Uint8Array(e.target.result);

      // console.log('data:::11', data.BYTES_PER_ELEMENT);

      const length = data.byteLength;
      for (let i = 0; i < length; i++) {
        binary += String.fromCharCode(data[i]);
      }
      const workbook: WorkBook = XLSX.read(binary, { type: 'binary' });

      // console.log('workbook:::', workbook);

      let memberTempExcelList: MemberTempExcelModel[] = [];

      workbook.SheetNames.forEach((item: any) => {
        const jsonArray = XLSX.utils.sheet_to_json<MemberTempExcelModel>(workbook.Sheets[item]);

        if (jsonArray.length === 0) {
          return;
        }

        memberTempExcelList = jsonArray;
      });

      const dataList: MemberTempCdoModel[] = [];

      // let memberTemp1: memberTempModel[] = [];
      if (memberTempExcelList && memberTempExcelList.length > 0) {
        setExcelDataRowCount(memberTempExcelList.length);

        memberTempExcelList.map((excelDataRow: MemberTempExcelModel) => {
          // const email: string = excelDataRow.Email;
          // const course: string = excelDataRow.Course;
          // const percentCompleted: number = excelDataRow['Percent Completed'];
          // const completedDateStr: string = excelDataRow['Completed (PST/PDT)'];
          // const emailArr =
          //   email && email.match('[a-zA-Z0-9_-]+@[a-zA-Z0-9._-]+');

          // const company: string = excelDataRow.Company;
          // const team: string = excelDataRow.Team;
          // const name: string = excelDataRow.Name;
          //const nickName: string = excelDataRow.NickName;

          // const memberId: string = excelDataRow.MemberId;
          const email: string = excelDataRow.Email;

          //멤버등록이면서 이메일, 강좌명, 멤버등록시간이 존재해야만, 처리대상에 포함.(이메일 형식이 맞는것)
          if (
            email &&
            email.length > 0
            // memberId &&
            // memberId.length > 0
            // company &&
            // company.length > 0 &&
            // team &&
            // team.length > 0 &&
            // name &&
            // name.length > 0 &&
            // nickName &&
            // nickName.length > 0
          ) {
            // if (memberId && memberId.length > 0) {
            const convertedRowData = MemberTempExcelModel.asCdo(excelDataRow);

            dataList.push(convertedRowData);
            // }
          }
        });

        if (dataList.length > 0) {
          memberTempProcService!.setMemberTempUdoList(dataList);
        }
      }
    };

    if (file && file instanceof File) {
      changeFileName('');

      //선택한 엑셀 파일 표기
      changeFileName(file.name);

      //멤버등록 처리전... 표기
      setIsProcessed(false);

      fileReader.readAsArrayBuffer(file);
    }
  }

  registerMemberTempComplete() {
    const { memberTempProcService } = this.props;
    const { getMemberTempUdoList, registerMemberTempComplete, setIsProcessed } = memberTempProcService!;

    const udos: MemberTempCdoModel[] = getMemberTempUdoList();

    if (udos && udos.length > 0) {
      registerMemberTempComplete(this.props.communityId, udos).then(() => {
        //멤버등록 처리 후 멤버등록 건수 보여주기
        setIsProcessed(true);
      });
    } else {
      this.setState({
        alertWinOpen: true,
        alertMessage: 'Member 일괄 등록 엑셀 파일을 선택하세요.',
        alertTitle: '안내',
        alertIcon: 'circle',
        alertType: '안내',
      });
    }
  }

  getDetailDescription(appliedResult: AppliedResult): string {
    if (appliedResult.toString() === 'NoLearners') {
      return AppliedResult.NoLearners;
    } else if (appliedResult.toString() === 'NoLearningCard') {
      return AppliedResult.NoLearningCard;
    } else if (appliedResult.toString() === 'TestExists') {
      return AppliedResult.TestExists;
    } else if (appliedResult.toString() === 'AlreadyBeenProcessed') {
      return AppliedResult.AlreadyBeenProcessed;
    } else if (appliedResult.toString() === 'DuplicationCardName') {
      return AppliedResult.DuplicationCardName;
    } else if (appliedResult.toString() === 'ProcessingSuccess') {
      return AppliedResult.ProcessingSuccess;
    } else if (appliedResult.toString() === 'NoStudents') {
      return AppliedResult.NoStudents;
    }

    return AppliedResult.Blank;
  }

  render() {
    const { alertWinOpen, alertType, alertTitle, alertIcon, alertMessage } = this.state;
    const { memberTempProcService } = this.props;
    const {
      fileName,
      isProcessed,
      excelDataRowCount,
      procTargetTotalListCount,
      processingSuccessTotalCount,
      memberTempProcList,
    } = memberTempProcService!;

    let completeDescriptionStr: any;

    if (isProcessed) {
      completeDescriptionStr = (
        <>
          멤버등록 처리 성공 <strong>{processingSuccessTotalCount}</strong>개
        </>
      );
    } else if (!isProcessed && procTargetTotalListCount > 0) {
      completeDescriptionStr = '멤버등록 처리 버튼을 눌러주세요.';
    } else {
      completeDescriptionStr = '멤버등록 처리 대상이 없습니다.';
    }

    return (
      <Container fluid>
        <Table celled>
          <colgroup>
            <col width="20%" />
            <col width="80%" />
          </colgroup>
          <Table.Body>
            <Table.Row>
              <Table.Cell>멤버 일괄 등록 양식</Table.Cell>
              <Table.Cell>
                <Button
                  className="file-select-btn"
                  content="양식 다운로드"
                  labelPosition="left"
                  icon="file"
                  href={baseUrl + 'resources/upload_member_sample.xlsx'}
                />
              </Table.Cell>
            </Table.Row>

            <Table.Row>
              <Table.Cell>멤버 일괄 등록</Table.Cell>
              <Table.Cell>
                <Button
                  className="file-select-btn"
                  content={fileName || '엑셀 파일 선택'}
                  labelPosition="left"
                  icon="file"
                  onClick={() => {
                    if (this.fileInputRef && this.fileInputRef.current) {
                      this.fileInputRef.current.click();
                    }
                  }}
                />
                <input
                  id="file"
                  type="file"
                  ref={this.fileInputRef}
                  accept=".xlsx, .xls"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    e.target.files && this.uploadFile(e.target.files[0])
                  }
                  hidden
                />
                <p>
                  ※ 엑셀 파일 내 [email]이 제대로 입력되어 있는지 확인해 주십시오.(CSV 파일은 엑셀문서로 변경해 주세요.)
                </p>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
        <Table celled>
          <colgroup>
            <col width="20%" />
            <col width="80%" />
          </colgroup>
          <Table.Body>
            <Table.Row>
              <Table.Cell>업로드 결과</Table.Cell>
              <Table.Cell className="list-info">
                <List>
                  <List.Item>
                    전체 <strong>{excelDataRowCount}</strong>개
                  </List.Item>
                  <List.Item>
                    멤버등록 처리 대상 <strong>{procTargetTotalListCount}</strong>개
                  </List.Item>
                  <List.Item>{completeDescriptionStr}</List.Item>
                </List>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
        <Grid className="list-info">
          <Grid.Row>
            <Grid.Column width={16}>
              <div className="right">
                {/* <Button
                  type="button"
                  onClick={() => this.registerMemberTempComplete()}
                >
                  <Icon name="minus" />
                  선택 멤버 삭제
                </Button> */}
                <Button
                  type="button"
                  onClick={() => {
                    this.registerMemberTempComplete();
                    memberTempProcService!.clearDisplay();
                  }}
                >
                  <Icon name="plus" />
                  멤버 일괄 등록 완료
                </Button>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Table celled selectable>
          <colgroup>
            <col width="5%" />
            <col width="10%" />
            <col width="10%" />
            <col width="10%" />
            <col width="10%" />
            <col width="10%" />
            <col width="5%" />
            <col width="10%" />
            <col width="10%" />
          </colgroup>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">소속사</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">소속 조직(팀)</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">성명</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">닉네임</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">E-mail</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">성공여부</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">오류상세</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">멤버등록시간</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {(memberTempProcList &&
              memberTempProcList.length &&
              memberTempProcList.map((model, index) => {
                return (
                  <Table.Row key={index}>
                    <Table.Cell textAlign="center">{index + 1}</Table.Cell>
                    <Table.Cell>{model.team}</Table.Cell>
                    <Table.Cell>{model.company}</Table.Cell>
                    <Table.Cell>{model.name}</Table.Cell>
                    <Table.Cell>{model.nickName}</Table.Cell>
                    <Table.Cell>{model.email}</Table.Cell>
                    <Table.Cell textAlign="center">{model.result}</Table.Cell>
                    <Table.Cell textAlign="center">{model.detail}</Table.Cell>
                    <Table.Cell textAlign="center">
                      {moment(model.registerTime).format('YYYY.MM.DD HH:mm:ss')}
                    </Table.Cell>
                  </Table.Row>
                );
              })) || (
              <Table.Row>
                <Table.Cell textAlign="center" colSpan={8}>
                  <div className="no-cont-wrap no-contents-icon">
                    <Icon className="no-contents80" />
                    <div className="sr-only">콘텐츠 없음</div>
                    <div className="text">검색 결과를 찾을 수 없습니다.</div>
                  </div>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
        <AlertWin
          message={alertMessage}
          open={alertWinOpen}
          alertIcon={alertIcon}
          title={alertTitle}
          type={alertType}
          handleClose={this.handleCloseAlertWin}
          handleOk={this.handleOkAlertWin}
        />
      </Container>
    );
  }
}

export default withRouter(MemberTempProcContainer);
