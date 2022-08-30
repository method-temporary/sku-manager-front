import React from 'react';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Breadcrumb, Button, Container, Grid, Header, Icon, Table, List } from 'semantic-ui-react';
import XLSX, { WorkBook } from 'xlsx';

import { mobxHelper, reactAutobind } from '@nara.platform/accent';

import { AlertWin } from 'shared/ui';
import { SelectType } from 'shared/model';
import { Loader } from 'shared/components';

import LinkedInTempProcService from '../../present/logic/LinkedInTempProcService';
import { LinkedInTempCdoModel } from '../../model/LinkedInTempCdoModel';
import { LinkedInTempExcelModel } from '../../model/LinkedInTempExcelModel';
import { AppliedResult } from '../../model/AppliedResult';
import { baseUrl } from '../../../../Routes';

interface Props extends RouteComponentProps<{ cineroomId: string }> {
  linkedInTempProcService?: LinkedInTempProcService;
}

interface State {
  alertWinOpen: boolean;
  alertIcon: string;
  alertTitle: string;
  alertType: string;
  alertMessage: any;
}

@inject(mobxHelper.injectFrom('linkedInTempProcService'))
@observer
@reactAutobind
class LinkedInTempProcContainer extends React.Component<Props, State> {
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
    //
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
    const { linkedInTempProcService } = this.props;
    const { changeFileName, setIsProcessed, clearDisplay, setExcelDataRowCount } = linkedInTempProcService!;

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

      let linkedInTempExcelList: LinkedInTempExcelModel[] = [];

      workbook.SheetNames.forEach((item: any) => {
        const jsonArray = XLSX.utils.sheet_to_json<LinkedInTempExcelModel>(workbook.Sheets[item]);

        if (jsonArray.length === 0) {
          return;
        }

        linkedInTempExcelList = jsonArray;
      });

      const dataList: LinkedInTempCdoModel[] = [];

      // let linkedInTemp1: linkedInTempModel[] = [];
      if (linkedInTempExcelList && linkedInTempExcelList.length > 0) {
        setExcelDataRowCount(linkedInTempExcelList.length);

        linkedInTempExcelList.forEach((excelDataRow: LinkedInTempExcelModel) => {
          const email: string = excelDataRow.Email;
          const course: string = excelDataRow.Cube;
          const percentCompleted: number = excelDataRow['Percent Completed'];
          const completedDateStr: string = excelDataRow['Completed (PST/PDT)'];
          const emailArr = email && email.match('[a-zA-Z0-9_-]+@[a-zA-Z0-9._-]+');

          //학습완료이면서 이메일, 강좌명, 학습완료시간이 존재해야만, 처리대상에 포함.(이메일 형식이 맞는것)
          if (percentCompleted && percentCompleted === 1) {
            if (
              email &&
              email.length > 0 &&
              course &&
              course.length > 0 &&
              completedDateStr &&
              completedDateStr.length > 0
            ) {
              if (emailArr && emailArr.length > 0) {
                const convertedRowData = LinkedInTempExcelModel.asCdo(excelDataRow);

                dataList.push(convertedRowData);
              }
            }
          }
        });

        if (dataList.length > 0) {
          linkedInTempProcService!.setLinkedInTempUdoList(dataList);
        }
      }
    };

    if (file && file instanceof File) {
      changeFileName('');

      //선택한 엑셀 파일 표기
      changeFileName(file.name);

      //학습완료 처리전... 표기
      setIsProcessed(false);

      fileReader.readAsArrayBuffer(file);
    }
  }

  registerLinkedInTempComplete() {
    const { linkedInTempProcService } = this.props;
    const { getLinkedInTempUdoList, registerLinkedInTempComplete, setIsProcessed } = linkedInTempProcService!;

    const udos: LinkedInTempCdoModel[] = getLinkedInTempUdoList();

    if (udos && udos.length > 0) {
      registerLinkedInTempComplete(udos).then(() => {
        //학습완료 처리 후 학습완료 건수 보여주기
        setIsProcessed(true);
      });
    } else {
      this.setState({
        alertWinOpen: true,
        alertMessage: 'LinkedIn 학습완료용 엑셀 파일을 선택하세요.',
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
    const { linkedInTempProcService } = this.props;
    const {
      fileName,
      isProcessed,
      excelDataRowCount,
      procTargetTotalListCount,
      processingSuccessTotalCount,
      linkedInTempProcList,
    } = linkedInTempProcService!;

    let completeDescriptionStr: any;

    if (isProcessed) {
      completeDescriptionStr = (
        <>
          학습완료 처리 성공 <strong>{processingSuccessTotalCount}</strong>개
        </>
      );
    } else if (!isProcessed && procTargetTotalListCount > 0) {
      completeDescriptionStr = '학습완료 처리 버튼을 눌러주세요!!!';
    } else {
      completeDescriptionStr = '학습완료 처리 대상이 없습니다.';
    }

    return (
      <Container fluid>
        <div>
          <Breadcrumb icon="right angle" sections={SelectType.LinkedinlearningStateSection} />
          <Header as="h2">LinkedIn 학습완료 처리</Header>
        </div>
        <Loader />
        <Table celled>
          <colgroup>
            <col width="20%" />
            <col width="80%" />
          </colgroup>
          <Table.Body>
            <Table.Row>
              <Table.Cell>파일 업로드</Table.Cell>
              <Table.Cell>
                <Button
                  className="file-select-btn"
                  content="양식 다운로드"
                  labelPosition="left"
                  icon="file"
                  href={baseUrl + 'resources/upload_linkedin_sample.xlsx'}
                />
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
                  ※ 엑셀 파일 내 [이름] [E-Mail], [Cube명], [학습상태(100%)], [학습완료 시간]이 제대로 입력되어 있는지
                  확인해 주십시오. (CSV 파일은 엑셀문서로 변경해 주세요.)
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
                    학습완료 처리 대상 <strong>{procTargetTotalListCount}</strong>개
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
                <Button type="button" onClick={() => this.registerLinkedInTempComplete()}>
                  <Icon name="plus" />
                  학습완료 처리
                </Button>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Table celled>
          <colgroup>
            <col width="5%" />
            <col width="10%" />
            <col width="20%" />
            <col width="32%" />
            <col width="10%" />
            <col width="7%" />
            <col width="8%" />
            <col width="8%" />
          </colgroup>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">성명</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">E-Mail</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">학습카드명</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">학습완료시간</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">성공여부</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">오류상세</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">업데이트시간</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {(linkedInTempProcList &&
              linkedInTempProcList.length &&
              linkedInTempProcList.map((model, index) => (
                <Table.Row key={index}>
                  <Table.Cell textAlign="center">{index + 1}</Table.Cell>
                  <Table.Cell>{model.name}</Table.Cell>
                  <Table.Cell>{model.email}</Table.Cell>
                  <Table.Cell>{model.cubeName}</Table.Cell>
                  <Table.Cell textAlign="center">{model.getCompletedTimeStr}</Table.Cell>
                  <Table.Cell textAlign="center">{model.result === 'Success' ? '성공' : '실패'}</Table.Cell>
                  <Table.Cell textAlign="center">{this.getDetailDescription(model.detail)}</Table.Cell>
                  <Table.Cell textAlign="center">{model.getAppliedTimeStr} </Table.Cell>
                </Table.Row>
              ))) || (
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

export default withRouter(LinkedInTempProcContainer);
