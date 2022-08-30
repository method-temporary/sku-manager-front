import * as React from 'react';
import { reactAutobind, reactAlert, reactConfirm, ReactComponent } from '@nara.platform/accent';
import { Select, Button, Modal, Form, Table, Pagination } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import TranscriptItemView from '../view/TranscirptItemView';
import { SharedService } from 'shared/present';
import TranscriptService from '../../subtitle/present/logic/TranscriptService';
import { baseUrl } from '../../../Routes';
import { download } from '../../present/apiclient/FileApi';
import { LoaderService } from 'shared/components/Loader/present/logic/LoaderService';
import { Loader } from 'shared/components';

const LANGUAGE_OPTIONS = [
  { key: 'ko', text: '한국어', value: 'ko' },
  { key: 'en', text: '영어', value: 'en' },
  { key: 'cn', text: '중국어', value: 'cn' },
];

interface Props {
  // list: any[]
  onClickTranscriptAdd: () => void;
  onClickTranscriptRemove: (idx: number) => void;
  panoptoName: string;
  panoptoDuration: string;
  deliveryId: string;
  uploadFile: (file: File, func?: any) => void;
  removeDeliveryIdLocale: (func?: any) => void;
  changePanoptoId: (deliveryId: string) => void;
  changeLanguage: (locale: string) => void;
}

interface States {
  open: boolean;
  language: string;
  pageIndex: number;
}

interface Injected {
  transcriptService: TranscriptService;
  sharedService: SharedService;
  loaderService: LoaderService;
}

@inject('transcriptService', 'sharedService', 'loaderService')
@observer
@reactAutobind
class TranscriptManageModal extends ReactComponent<Props, States, Injected> {
  private fileInputRef = React.createRef<HTMLInputElement>();

  constructor(props: Props) {
    super(props);
    this.state = {
      open: false,
      language: 'ko',
      pageIndex: 0,
    };
  }

  onOpenModal() {
    this.setState({
      open: true,
    });
  }

  onCloseModal() {
    this.setState({
      open: false,
    });
  }

  onChangeTextProps(index: number, name: string, value: any) {
    const { transcriptService } = this.injected;

    if (transcriptService != null) {
      transcriptService.changeTranscript(index, name, value);
    }
  }

  onChangeTranscriptLanguageProps(name: string, language: string) {
    this.setState({
      language,
    });

    this.findTranscriptList(1, language);
  }

  findTranscriptList(page: number, searchLanguage?: string) {
    const { deliveryId, changeLanguage } = this.props;
    const { transcriptService, sharedService } = this.injected;
    const { language } = this.state;

    if (transcriptService) {
      transcriptService.clear();
    }

    if (transcriptService && sharedService) {
      //조회.
      let offset = 1;
      const limit = 100;
      const locale = searchLanguage || language;
      if (searchLanguage) {
        this.setState({
          language: searchLanguage,
        });
        changeLanguage(searchLanguage);
      }

      if (page) {
        sharedService.setPage('transcript', page);
        offset = (page - 1) * limit;

        this.setState({ pageIndex: offset });
      } else {
        sharedService.setPageMap('transcript', 0, limit);
      }

      transcriptService.findTranscriptList(deliveryId, locale, offset, limit).then((transcripts) => {
        if (transcripts && transcripts.totalCount) {
          sharedService.setCount('transcript', transcripts.totalCount);
        } else {
          sharedService.setCount('transcript', 0);
        }
      });
    }
  }

  async onUploadFile(file: File) {
    const { loaderService } = this.injected;
    const { uploadFile } = this.props;

    loaderService.openLoader(true);
    await uploadFile(file, this.findTranscriptList);
    loaderService.closeLoader(true);
  }

  onRemoveDeliveryIdLocale() {
    const { loaderService } = this.injected;
    const { deliveryId, removeDeliveryIdLocale } = this.props;
    const { language } = this.state;

    const locale = LANGUAGE_OPTIONS.filter((locale) => locale.value === language)[0]?.text || '';

    if (locale) {
      reactConfirm({
        title: '알림',
        message: locale.concat(' Transcript 일괄 삭제하시겠습니까?'),
        onOk: async () => {
          if (deliveryId && language) {
            loaderService.openLoader(true);
            await removeDeliveryIdLocale(this.findTranscriptList);
            loaderService.closeLoader(true);
          }
        },
      });
    } else {
      reactAlert({ title: '안내', message: '오류가 있습니다.' });
    }
  }

  checkForDuplicates(array: any[], keyName: string) {
    return new Set(array.map((item) => item[keyName])).size !== array.length;
  }

  checkForTimeValidation(array: any[]) {
    let rtn = true;
    array.map((item) => {
      if (!item.startTime || !item.endTime || parseInt(item.endTime) < parseInt(item.startTime)) {
        rtn = false;
      }
    });
    return rtn;
  }

  handleOk() {
    //
    //Transcript Save로직 추가 후 모달 Close
    const { transcriptService } = this.injected;

    const arr = transcriptService?.transcriptModelList;

    if (!arr || (arr.length === 1 && !arr[0].startTime && !arr[0].endTime && !arr[0].text)) {
      this.onCloseModal();
      return;
    }

    //중복시간 체크
    if (this.checkForDuplicates(arr, 'startTime') || this.checkForDuplicates(arr, 'endTime')) {
      reactAlert({ title: '안내', message: '동일한 시간에 대본을 입력할 수 없습니다.' });
      return;
    }

    //시작-종료값 체크
    if (!this.checkForTimeValidation(arr)) {
      reactAlert({ title: '안내', message: '종료시간은 시작시간보다 작을 수 없습니다.' });
      return;
    }

    let binData = false;
    arr.map((data) => {
      if (data.text == '' || data.text == undefined) {
        binData = true;
      }
    });

    if (binData) {
      reactAlert({ title: '안내', message: 'Transcript 내용을 입력해주세요.' });
      return;
    }

    transcriptService.registerTranscript().then((response: any) => {
      if (response == 'Save Success') {
        reactAlert({ title: '안내', message: 'Transcript 저장이 성공했습니다.' });
      } else {
        reactAlert({ title: '안내', message: 'Transcript 저장이 실패했습니다.' });
      }
    });

    transcriptService.clear();
    this.onCloseModal();
  }

  handleCancel() {
    const { transcriptService } = this.injected;

    if (transcriptService != null) {
      transcriptService.clear();
    }

    this.onCloseModal();
  }

  render() {
    const { transcripts, transcriptModelList, transcriptCount } = this.injected.transcriptService;
    const { pageMap } = this.injected.sharedService;
    const totalCount = transcripts && transcripts.totalCount;

    const {
      // list,
      deliveryId,
      onClickTranscriptAdd,
      onClickTranscriptRemove,
      uploadFile,
      changePanoptoId,
      changeLanguage,
      panoptoName,
      panoptoDuration,
    } = this.props;
    const { pageIndex } = this.state;
    return (
      <>
        <React.Fragment>
          <Modal
            size="large"
            open={this.state.open}
            onOpen={this.onOpenModal}
            onClose={this.onCloseModal}
            trigger={<Button type="button">관리</Button>}
          >
            <Modal.Header>관리</Modal.Header>

            <Modal.Content scrolling>
              <Loader>
                <Table celled>
                  <colgroup>
                    <col width="20%" />
                    <col width="80%" />
                  </colgroup>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell colSpan={2} className="title-header">
                        Cube 정보
                      </Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    <Table.Row>
                      <Table.Cell className="tb-header">Cube명</Table.Cell>
                      <Table.Cell>{panoptoName}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell className="tb-header">재생시간</Table.Cell>
                      <Table.Cell>{panoptoDuration}</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>

                <Table celled>
                  <colgroup>
                    <col width="20%" />
                    <col width="80%" />
                  </colgroup>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell colSpan={2} className="title-header">
                        Caption 관리
                      </Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    <Table.Row>
                      <Table.Cell className="tb-header">업로드</Table.Cell>
                      <Table.Cell>
                        <strong>영상 하단에 표시되는 Caption(자막)은 Panopto 관리에서 등록이 가능합니다.</strong>
                        <br />
                        <a
                          href="https://sku.ap.panopto.com/Panopto/Pages/Auth/Login.aspx?support=true"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <strong>Panopto 관리 바로가기</strong>
                        </a>
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>

                <Table celled>
                  <colgroup>
                    <col width="20%" />
                    <col width="80%" />
                  </colgroup>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell colSpan={2} className="title-header">
                        Transcript 업로드
                      </Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    <Table.Row>
                      <Table.Cell className="tb-header">언어</Table.Cell>
                      <Table.Cell>
                        <Form.Group style={{ display: 'flex', position: 'relative' }}>
                          <Form.Field
                            control={Select}
                            width={14}
                            placeholder="Select"
                            options={LANGUAGE_OPTIONS}
                            defaultValue={LANGUAGE_OPTIONS[0].value}
                            // value="Basic"
                            onChange={(e: any, data: any) => {
                              changeLanguage(data.value);
                              this.onChangeTranscriptLanguageProps('locale', data.value);
                            }}
                          />
                          <Button
                            primary
                            onClick={() => {
                              changeLanguage(this.state.language);
                              changePanoptoId(deliveryId);
                              this.onRemoveDeliveryIdLocale();
                            }}
                          >
                            일괄 삭제
                          </Button>
                        </Form.Group>
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>

                  <Table.Body>
                    <Table.Row>
                      <Table.Cell className="tb-header">일괄 등록</Table.Cell>
                      <Table.Cell>
                        <Button
                          className="file-select-btn"
                          content="파일 첨부"
                          labelPosition="left"
                          icon="file"
                          onClick={() => {
                            if (this.fileInputRef && this.fileInputRef.current) {
                              this.fileInputRef.current.click();

                              changeLanguage(this.state.language);
                              changePanoptoId(deliveryId);
                            }
                          }}
                        />
                        <input
                          id="file"
                          type="file"
                          ref={this.fileInputRef}
                          accept=".srt"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            e.target.files && this.onUploadFile(e.target.files[0]);
                          }}
                          hidden
                        />
                        <Button
                          className="file-select-btn"
                          content="예시 파일"
                          labelPosition="left"
                          icon="file"
                          basic={true}
                          // as="a"
                          // download
                          // href={baseUrl + 'resources/transcript_upload_sample.srt'}
                          onClick={() => {
                            download(
                              baseUrl + 'resources/transcript_upload_sample.srt',
                              'transcript_upload_sample.srt'
                            );
                          }}
                        />
                        <br /> SRT 파일로 Transcript 내용 일괄 등록하실 수 있습니다.
                        <br /> 예시 파일을 통해 입력 형식을 맞춰주세요.
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>

                <Form>
                  <TranscriptItemView
                    // transcriptService={transcriptService}
                    // sharedService={sharedService}
                    transcriptModelList={transcriptModelList}
                    transcriptCount={transcriptCount}
                    onClickTranscriptAdd={onClickTranscriptAdd}
                    onClickTranscriptRemove={onClickTranscriptRemove}
                    deliveryId={deliveryId}
                    onChangeTextProps={this.onChangeTextProps}
                    language={this.state.language}
                    findTranscriptList={this.findTranscriptList}
                  />
                  {totalCount === 0 ? null : (
                    <div className="center pagination-area">
                      <Pagination
                        activePage={pageMap.get('transcript') ? pageMap.get('transcript').page : 1}
                        totalPages={pageMap.get('transcript') ? pageMap.get('transcript').totalPages : 1}
                        onPageChange={(e, data) => this.findTranscriptList(data.activePage as number)}
                      />
                    </div>
                  )}
                </Form>
              </Loader>
            </Modal.Content>

            <Modal.Actions>
              <Button className="w190 d" onClick={() => this.handleCancel()}>
                Cancel
              </Button>
              <Button className="w190 p" onClick={() => this.handleOk()}>
                OK
              </Button>
            </Modal.Actions>
          </Modal>
        </React.Fragment>
      </>
    );
  }
}

export default TranscriptManageModal;
