import React from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Grid, Icon, List, Modal, Table } from 'semantic-ui-react';
import XLSX, { WorkBook } from 'xlsx';

import { mobxHelper, reactAutobind } from '@nara.platform/accent';

import { SendEmailExcelModel, SendEmailRdoModel, SelectType } from 'shared/model';
import { SendEmailService, SharedService } from 'shared/present';
import { AlertWin } from 'shared/ui';

import { baseUrl } from 'Routes';

import { getPolyglotToAnyString, getPolyglotToDefaultString } from '../Polyglot';
import { Language } from '../Polyglot';

interface Props {
  onClose: () => void;
  sendEmailService?: SendEmailService;
  sharedService?: SharedService;
}

interface States {
  openModal: boolean;
  alertWinOpen: boolean;
  alertIcon: string;
  alertTitle: string;
  alertType: string;
  alertMessage: any;
}

@inject(mobxHelper.injectFrom('sendEmailService', 'sharedService'))
@observer
@reactAutobind
class SendEmailFileModal extends React.Component<Props, States> {
  private fileInputRef = React.createRef<HTMLInputElement>();

  constructor(props: Props) {
    super(props);
    this.state = {
      openModal: false,
      alertWinOpen: false,
      alertIcon: '',
      alertTitle: '',
      alertType: '',
      alertMessage: '',
    };
  }

  componentDidMount(): void {
    this.setState({ openModal: true });
  }

  //
  componentDidUpdate(prevProps: Props) {
    //
  }

  // 화면 나갈때 액션
  componentWillUnmount() {
    const { sendEmailService } = this.props;
    const { clearFileDisplay, changeFileName } = sendEmailService!;
    // 초기화
    clearFileDisplay();
    // 파일이름 초기화 같이 하면 순서가 변경되서 잘 안됌.
    changeFileName('');
  }

  close() {
    this.closePop();
  }

  //
  closePop() {
    const { onClose } = this.props;
    this.setState({ openModal: false });
    if (onClose) {
      onClose();
    }
  }

  onhandleApply() {
    const { sendEmailService } = this.props;
    const { sendEmailTempProcList, changeSelectedStudentEmailProps } = sendEmailService!;

    const emailList: string[] = [];
    const nameList: string[] = [];

    // console.log(emailList.length);
    sendEmailTempProcList?.forEach((rdo) => {
      // 외부 메일도 보낼 수 있다.
      // if (rdo.member) {
      //   emailList.push(rdo.email);
      //   nameList.push(rdo.name);
      // }
      emailList.push(rdo.email);
      if (rdo.member) {
        nameList.push(getPolyglotToDefaultString(rdo.userName, Language.Ko));
      } else {
        nameList.push(rdo.email);
      }
    });
    nameList.sort();
    nameList.reverse();

    if (emailList.length === 0) {
      this.confirmBlank('수신할 이메일이 없습니다.');
      return;
    }

    changeSelectedStudentEmailProps(emailList, nameList, '', SelectType.mailOptions[7].value);

    this.close();
  }

  confirmBlank(message: string) {
    //
    this.setState({
      alertMessage: message,
      alertWinOpen: true,
      alertTitle: '필수 정보 입력 안내',
      alertIcon: 'triangle',
      alertType: 'justOk',
    });
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
    const { sendEmailService } = this.props;
    const { changeFileName, clearFileDisplay, setExcelDataRowCount } = sendEmailService!;

    // console.log('file:::111', file);
    const fileReader = new FileReader();

    fileReader.onload = (e: any) => {
      //엑셀 파일 불러오기시 기존 데이터 처리 표기 부분 초기화(그리드 포함)
      clearFileDisplay();

      let binary: string = '';
      const data = new Uint8Array(e.target.result);

      // console.log('data:::11', data.BYTES_PER_ELEMENT);

      const length = data.byteLength;
      for (let i = 0; i < length; i++) {
        binary += String.fromCharCode(data[i]);
      }
      const workbook: WorkBook = XLSX.read(binary, { type: 'binary' });

      // console.log('workbook:::', workbook);

      let sendEmailTempExcelList: SendEmailExcelModel[] = [];

      workbook.SheetNames.forEach((item: any) => {
        const jsonArray = XLSX.utils.sheet_to_json<SendEmailExcelModel>(workbook.Sheets[item]);

        if (jsonArray.length === 0) {
          return;
        }

        sendEmailTempExcelList = jsonArray;
      });

      const dataList: SendEmailRdoModel[] = [];

      if (sendEmailTempExcelList && sendEmailTempExcelList.length > 0) {
        setExcelDataRowCount(sendEmailTempExcelList.length);

        sendEmailTempExcelList?.forEach((excelDataRow: SendEmailExcelModel) => {
          const email: string = excelDataRow.Email;

          if (email && email.length > 0) {
            const convertedRowData = SendEmailExcelModel.asCdo(excelDataRow);
            dataList.push(convertedRowData);
          }
        });

        if (dataList.length > 0) {
          sendEmailService!.setSendEmailUdoList(dataList);
        }
      }
    };

    if (file && file instanceof File) {
      //선택한 엑셀 파일 표기
      changeFileName(file.name);

      fileReader.readAsArrayBuffer(file);
    }
  }

  confirmEmail(page?: number) {
    const { sharedService, sendEmailService } = this.props;
    const { getSendEmailUdoList, confirmEmail, setProcTargetTotalListCount, setProcTargetRegistCount } =
      sendEmailService!;

    if (sharedService && sendEmailService) {
      // let offset = 0;
      // if (page) {
      //   sharedService.setPage('resultMailDetailModel', page);
      //   offset = (page - 1) * sendEmailService.resultMailQuery.limit;
      //   sendEmailService.changeResultMailQueryProps('currentPage', page);
      // } else {
      //   sharedService.setPageMap(
      //     'excelFileModel',
      //     0,
      //     sendEmailService.resultMailQuery.limit
      //   );
      // }

      const udos: SendEmailRdoModel[] = getSendEmailUdoList();
      if (udos && udos.length > 0) {
        confirmEmail(udos).then((res) => {
          setProcTargetTotalListCount(res.length);
          setProcTargetRegistCount(res.length);
          //등록 처리 대상 건수
          // let regCount = 0;
          // 외부 메일도 보낼 수 있다
          // res.map((rdo) => {
          //   regCount = rdo.member ? regCount + 1 : regCount;
          // });
          // setProcTargetRegistCount(regCount);
        });
        // .then(() => {
        //   if (page) this.setState({ pageIndex: (page - 1) * 20 });
        // })
        // .then(() =>
        //   sharedService.setCount(
        //     'excelFileModel',
        //     sendEmailService.resultMailDetailModels.totalCount
        //   )
        // );
      } else {
        this.setState({
          alertWinOpen: true,
          alertMessage: '일괄 등록 엑셀 파일을 선택하세요.',
          alertTitle: '안내',
          alertIcon: 'circle',
          alertType: '안내',
        });
      }
    }
  }

  render() {
    const { alertWinOpen, alertType, alertTitle, alertIcon, alertMessage } = this.state;
    const { sendEmailService } = this.props;
    const { fileName, excelDataRowCount, procTargetTotalListCount, procTargetRegistCount, sendEmailTempProcList } =
      sendEmailService!;
    const { openModal } = this.state;

    return (
      <>
        <React.Fragment>
          <Modal
            size="large"
            open={openModal}
            closeOnDimmerClick={false} // dim 클릭으로 닫기  true : O, false : X
            onClose={this.close}
          >
            <Modal.Header>메일 엑셀 업로드</Modal.Header>
            <Modal.Content>
              <Table celled>
                <colgroup>
                  <col width="20%" />
                  <col width="80%" />
                </colgroup>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>
                      <strong>일괄 등록</strong>
                    </Table.Cell>
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
                      <Button
                        className="file-select-btn"
                        content="양식 다운로드"
                        labelPosition="left"
                        icon="file"
                        href={baseUrl + 'resources/upload_sample.xlsx'}
                      />
                      <p />※ 엑셀 파일 내 [ <strong>email</strong> ] 이 제대로 입력되어 있는지 확인해 주십시오.(CSV
                      파일은 엑셀문서로 변경해 주세요.)
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>
                      <strong>업로드 결과</strong>
                    </Table.Cell>
                    <Table.Cell className="list-info">
                      <List>
                        <List.Item style={{ height: 20 }}>
                          전체 <strong>{excelDataRowCount}</strong>명
                        </List.Item>
                        <List.Item>
                          등록 처리 대상
                          <strong>{procTargetRegistCount}</strong>명
                        </List.Item>
                      </List>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
              <Grid>
                <Grid.Row>
                  <Grid.Column width={16}>
                    <div className="center">
                      <Button
                        type="button"
                        onClick={() => {
                          this.confirmEmail();
                        }}
                      >
                        등록하기
                      </Button>
                    </div>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
              <Grid className="list-info">
                <Grid.Row>
                  <Grid.Column
                    width={16}
                    style={{
                      fontSize: '0.9rem',
                      padding: 0,
                    }}
                  >
                    <span>
                      총 <strong>{procTargetTotalListCount}</strong>명
                    </span>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
              <Table celled>
                <colgroup>
                  <col width="5%" />
                  <col width="25%" />
                  <col width="25%" />
                  <col width="20%" />
                  <col />
                </colgroup>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
                    <Table.HeaderCell textAlign="center">소속사</Table.HeaderCell>
                    <Table.HeaderCell textAlign="center">소속 조직(팀)</Table.HeaderCell>
                    <Table.HeaderCell textAlign="center">성명</Table.HeaderCell>
                    <Table.HeaderCell textAlign="center">E-mail</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {(sendEmailTempProcList &&
                    sendEmailTempProcList.length &&
                    sendEmailTempProcList.map((model, index) => (
                      <Table.Row key={index}>
                        <Table.Cell textAlign="center">{index + 1}</Table.Cell>
                        <Table.Cell>{getPolyglotToAnyString(model.departmentName)}</Table.Cell>
                        <Table.Cell>{getPolyglotToAnyString(model.companyName)}</Table.Cell>
                        <Table.Cell>{getPolyglotToAnyString(model.userName)}</Table.Cell>
                        <Table.Cell>{model.email}</Table.Cell>
                      </Table.Row>
                    ))) || (
                    <Table.Row>
                      <Table.Cell textAlign="center" colSpan={6}>
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
              {/* {procTargetTotalListCount === 0 ? null : (
                <>
                  <div className="center">
                    <Pagination
                      activePage={
                        pageMap.get('excelFileModel')
                          ? pageMap.get('excelFileModel').page
                          : 1
                      }
                      totalPages={
                        pageMap.get('excelFileModel')
                          ? pageMap.get('excelFileModel').totalPages
                          : 1
                      }
                      onPageChange={(e, data) =>
                        this.confirmEmail(data.activePage as number)
                      }
                    />
                  </div>
                </>
              )} */}
              <AlertWin
                message={alertMessage}
                open={alertWinOpen}
                alertIcon={alertIcon}
                title={alertTitle}
                type={alertType}
                handleClose={this.handleCloseAlertWin}
                handleOk={this.handleOkAlertWin}
              />
            </Modal.Content>
            <Modal.Actions>
              <Button onClick={this.close} type="button">
                취소
              </Button>
              <Button primary onClick={this.onhandleApply} type="button">
                적용
              </Button>
            </Modal.Actions>
          </Modal>
        </React.Fragment>
      </>
    );
  }
}

export default SendEmailFileModal;
