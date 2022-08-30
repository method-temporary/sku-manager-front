import React from 'react';
import { reactAutobind } from '@nara.platform/accent';
import { observer } from 'mobx-react';

import { ButtonProps, Button, Form, Table, Select, Modal, Input, Search } from 'semantic-ui-react';
import { LoaderService } from '../../../Loader/present/logic/LoaderService';
import { registerExcelHistory } from './present/apiclient/ExcelButtonApi';
import { getExcelHistoryParams, setExcelHistoryParams } from './store/ExcelHistoryStore';
import { initExcelHistory } from './model/ExcelHistoryModel';

interface Props extends ButtonProps {
  download?: boolean;
  useDownloadHistory?: boolean;
  onClick: () => Promise<any>;
  children?: React.ReactNode;
}

@observer
@reactAutobind
class ExcelButton extends React.Component<Props> {
  //
  static defaultProps = {
    useDownloadHistory: true,
    download: false,
  };

  state = {
    modalOpen: false,
    downloadReason: '',
    downloadError: null,
  };

  handleDownloadReason(e: any) {
    this.setState({
      downloadError: null,
      downloadReason: e.target.value,
    });
  }

  handleDownloadHistory(fileName: string) {
    const { downloadReason } = this.state;

    // TODO! : API 페이지별로 적용한 부분 개선
    const excelHistoryPrams = getExcelHistoryParams();
    const searchParam = JSON.stringify({
      url: excelHistoryPrams?.searchUrl || '',
      param: excelHistoryPrams?.searchParam || '',
    });
    const workType = excelHistoryPrams?.workType || '';

    try {
      registerExcelHistory({ downloadReason, fileName, searchParam, workType });
    } finally {
      this.setState({
        downloadReason: '',
      });
      setExcelHistoryParams(initExcelHistory());
    }
  }

  async downloadFn(e: any) {
    e.preventDefault();
    const { downloadReason } = this.state;
    //validate
    if (!downloadReason) {
      this.setState({
        downloadError: {
          content: '필수 입력 사항입니다.',
        },
      });
      return;
    }
    if (downloadReason.length < 5) {
      this.setState({
        downloadError: {
          content: '5글자 이상 입력해주세요.',
        },
      });
      return;
    }
    this.setState({
      modalOpen: false,
    });
    await LoaderService.instance.excelDownloadloadingCallback(this.props.onClick, this.handleDownloadHistory);
  }

  async onClick(): Promise<void> {
    // 행정안전부 고시 제2019-47호에 따라 개인정보를 다운로드 하는 경우, 다운로드를 하는 사유등록
    if (this.props.download && this.props.useDownloadHistory) {
      this.setState({ modalOpen: true });
      return;
    }

    if (!this.props.useDownloadHistory) setExcelHistoryParams(initExcelHistory());

    await LoaderService.instance.loadingCallback(this.props.onClick);
  }

  render() {
    //
    const { download, useDownloadHistory, children, onClick, ...rest } = this.props;
    const { modalOpen, downloadReason, downloadError } = this.state;
    return (
      <>
        <Button {...rest} type="button" onClick={this.onClick}>
          {children || download ? '엑셀 다운로드' : '엑셀 업로드'}
        </Button>
        <Modal open={modalOpen} size="large">
          <Modal.Header className="res">엑셀 다운로드</Modal.Header>
          <Modal.Content scrolling className="fit-layout">
            <Form>
              <Table celled>
                <colgroup>
                  <col width="20%" />
                  <col width="80%" />
                </colgroup>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell className="tb-header">
                      다운로드 사유 <span className="required">*</span>
                    </Table.Cell>
                    <Table.Cell>
                      <Form.Group>
                        <Form.Field
                          control={Input}
                          width={16}
                          value={downloadReason}
                          onChange={(e: any) => {
                            this.handleDownloadReason(e);
                          }}
                          onKeyPress={(e: any) => {
                            if (e.key == 'Enter') {
                              this.downloadFn(e);
                            }
                          }}
                          error={downloadError}
                        />
                      </Form.Group>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button
              className="w190 d"
              onClick={() => {
                this.setState({
                  modalOpen: false,
                  downloadReason: '',
                });
              }}
            >
              취소
            </Button>
            <Button
              className="w190 p"
              onClick={(e) => {
                this.downloadFn(e);
              }}
            >
              다운로드
            </Button>
          </Modal.Actions>
        </Modal>
      </>
    );
  }
}

export default ExcelButton;
