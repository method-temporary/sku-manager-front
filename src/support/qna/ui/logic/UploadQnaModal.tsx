import React from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Grid, Icon, List, Modal, Table } from 'semantic-ui-react';

import { mobxHelper, reactAutobind } from '@nara.platform/accent';

import { SharedService } from 'shared/present';
import { AlertWin } from 'shared/ui';

import { baseUrl } from 'Routes';
import { QnaService } from 'support';

interface Props {
  onClose: () => void;
  qnaService?: QnaService;
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

@inject(mobxHelper.injectFrom('qnaService', 'sharedService'))
@observer
@reactAutobind
class UploadQnaModal extends React.Component<Props, States> {
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
    const { qnaService } = this.props;
    const { clearFileDisplay, changeFileName } = qnaService!;
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
    //
  }

  confirmMessage(message: string) {
    //
    this.setState({
      alertMessage: message,
      alertWinOpen: true,
      alertTitle: '알림',
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
  }

  confirmEmail(page?: number) {
    //
  }

  render() {
    const { alertWinOpen, alertType, alertTitle, alertIcon, alertMessage } = this.state;
    const { qnaService } = this.props;
    const { fileName, excelDataRowCount, procTargetTotalListCount, procTargetRegistCount, sendEmailTempProcList } =
      qnaService!;
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
            <Modal.Header>문의 일괄 등록</Modal.Header>
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
                        content={fileName || '파일 선택'}
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
                        // 양식 파일 확인 필요
                        href={baseUrl + 'resources/upload_sample.xlsx'}
                      />
                      <p />※ 엑셀 파일 내 모든 항목이 제대로 입력되어 있는지 확인해 주십시오.
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>
                      <strong>업로드 결과</strong>
                    </Table.Cell>
                    <Table.Cell className="list-info">
                      <List>
                        <List.Item style={{ height: 20 }}>
                          전체 <strong>{excelDataRowCount}</strong>개
                        </List.Item>
                        <List.Item>
                          등록 처리 건수
                          <strong>{procTargetRegistCount}</strong>개
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
                      총 <strong>{procTargetTotalListCount}</strong>건
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
                  <col width="20%" />
                  <col width="20%" />
                  <col width="20%" />
                  <col width="20%" />
                  <col width="20%" />
                  <col width="20%" />
                  <col width="20%" />
                  <col width="20%" />
                  <col width="20%" />
                  <col width="20%" />
                  <col width="20%" />
                  <col width="20%" />
                  <col width="20%" />
                  <col width="20%" />
                  <col />
                </colgroup>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
                    <Table.HeaderCell textAlign="center">접수채널</Table.HeaderCell>
                    <Table.HeaderCell textAlign="center">카테고리</Table.HeaderCell>
                    <Table.HeaderCell textAlign="center">세부 카테고리</Table.HeaderCell>
                    <Table.HeaderCell textAlign="center">과정명</Table.HeaderCell>
                    <Table.HeaderCell textAlign="center">문의자 소속</Table.HeaderCell>
                    <Table.HeaderCell textAlign="center">문의자 부서</Table.HeaderCell>
                    <Table.HeaderCell textAlign="center">문의자 이름</Table.HeaderCell>
                    <Table.HeaderCell textAlign="center">문의자 이메일</Table.HeaderCell>
                    <Table.HeaderCell textAlign="center">문의 제목</Table.HeaderCell>
                    <Table.HeaderCell textAlign="center">문의 내용</Table.HeaderCell>
                    <Table.HeaderCell textAlign="center">문의일자</Table.HeaderCell>
                    <Table.HeaderCell textAlign="center">처리상태</Table.HeaderCell>
                    <Table.HeaderCell textAlign="center">담당조직</Table.HeaderCell>
                    <Table.HeaderCell textAlign="center">답변 담당자</Table.HeaderCell>
                    <Table.HeaderCell textAlign="center">답변 담당자 이메일</Table.HeaderCell>
                    <Table.HeaderCell textAlign="center">답변 내용</Table.HeaderCell>
                    <Table.HeaderCell textAlign="center">답변일자</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {(sendEmailTempProcList &&
                    sendEmailTempProcList.length &&
                    sendEmailTempProcList.map((model, index) => (
                      <Table.Row key={index}>
                        <Table.Cell textAlign="center">{index + 1}</Table.Cell>
                        <Table.Cell>{1}</Table.Cell>
                        <Table.Cell>{2}</Table.Cell>
                        <Table.Cell>{3}</Table.Cell>
                        <Table.Cell>{4}</Table.Cell>
                        <Table.Cell>{4}</Table.Cell>
                        <Table.Cell>{4}</Table.Cell>
                        <Table.Cell>{4}</Table.Cell>
                        <Table.Cell>{4}</Table.Cell>
                        <Table.Cell>{4}</Table.Cell>
                        <Table.Cell>{4}</Table.Cell>
                        <Table.Cell>{4}</Table.Cell>
                        <Table.Cell>{4}</Table.Cell>
                        <Table.Cell>{4}</Table.Cell>
                        <Table.Cell>{4}</Table.Cell>
                        <Table.Cell>{4}</Table.Cell>
                        <Table.Cell>{4}</Table.Cell>
                        <Table.Cell>{4}</Table.Cell>
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

export default UploadQnaModal;
