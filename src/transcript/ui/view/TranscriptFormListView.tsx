import * as React from 'react';
import { Button, Modal, Form, Table, Pagination, Grid, Container, Breadcrumb, Header, Icon } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import moment from 'moment';

import { reactAlert, reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectType } from 'shared/model';
import { SharedService } from 'shared/present';
import { Loader } from 'shared/components';
import { LoaderService } from 'shared/components/Loader';

import { InternalMediaConnectionModel } from '../../../cube/media/model/old/InternalMediaConnectionModel';
import { MediaService } from '../../../cube/media';
import { CollegeService } from '../../../college';
import { SubtitleModel } from '../../subtitle/model/SubtitleModel';
import TranscriptService from '../../subtitle/present/logic/TranscriptService';
import TranscriptManageModal from '../logic/TranscriptManageModal';
import SearchBox from '../logic/SearchBox';

interface Props {
  uploadFile: (file: File, func?: any) => void;
  removeDeliveryIdLocale: (func?: any) => void;
  subtitleModel: SubtitleModel;
  changePanoptoId: (deliveryId: string) => void;
  changeLanguage: (locale: string) => void;
}

interface State {
  list: any[];
  pageIndex: number;
}

interface Injected {
  mediaService: MediaService;
  sharedService: SharedService;
  collegeService: CollegeService;
  transcriptService: TranscriptService;
  loaderService: LoaderService;
}

@inject('mediaService', 'sharedService', 'collegeService', 'transcriptService', 'loaderService')
@observer
@reactAutobind
class TranscriptFormListView extends ReactComponent<Props, State, Injected> {
  //
  state = {
    list: [
      { text: 'Nathan', index: 25, idx: 0 },
      { text: 'Jack', index: 30, idx: 1 },
      { text: 'Joe', index: 28, idx: 2 },
    ],
    pageIndex: 0,
  };

  private fileInputRef = React.createRef<HTMLInputElement>();

  constructor(props: Props) {
    super(props);
  }

  async componentDidMount(): Promise<void> {
    //
    const { mediaService, collegeService } = this.injected;
    const year = 1;
    const endDate = moment().endOf('day');
    let startDate = moment().startOf('day');
    startDate = startDate.subtract(-1, 'day');
    if (year) startDate = startDate.subtract(year, 'y');

    await this.findAllColleges();

    mediaService?.changePanoptoCdoProps('college', collegeService?.colleges[0].id || '');
    mediaService?.changePanoptoCdoProps('folderId', collegeService?.colleges[0].panoptoFolderId || '');
    mediaService?.changePanoptoCdoProps('startDate', moment().subtract(1, 'week').startOf('day').toDate().getTime());
    mediaService?.changePanoptoCdoProps('endDate', moment().endOf('day').toDate().getTime());
    this.onSearch();
    //this.selectCollege('college',  collegeSelect[0].text)
  }

  componentDidUpdate(): void {}

  async findAllColleges() {
    //
    const { collegeService } = this.injected;
    if (collegeService) await collegeService.findAllColleges();
  }

  async findPanoptoList(page?: number) {
    const { sharedService, mediaService, loaderService } = this.injected;
    const { panoptoCdo } = this.injected.mediaService;

    loaderService.openLoader(true);

    if (sharedService && mediaService) {
      if (page) {
        sharedService.setPage('panopto', page);
        mediaService.changePanoptoCdoProps('currentPage', page);
        this.setState({ pageIndex: (page - 1) * 10 });
      } else {
        sharedService.setPageMap('panopto', 0, Number(panoptoCdo.page_size));
      }
      await mediaService.findPanoptoDatelessList().then((panoptos) => {
        if (panoptos.totalCount) {
          sharedService.setCount('panopto', panoptos.totalCount);
        } else sharedService.setCount('panopto', 0);
      });
    }

    loaderService.closeLoader(true);
  }

  selectPanopto(panopto: InternalMediaConnectionModel) {
    const { mediaService } = this.injected;
    if (mediaService) {
      panopto.viewUrl = panopto.viewUrl.replace('Viewer', 'Embed');
      mediaService.setPanoptoProps(panopto);
    }
  }

  goToVieo(url: string) {
    //
    const viewerToEmbedViewURL = url.replace('Viewer', 'Embed');
    window.open(viewerToEmbedViewURL);
  }

  goToPopup(deliveryId: string) {
    reactAlert({ title: '알림', message: deliveryId });
  }

  onChangePanoptoFileName(name: string, value: string) {
    //
    const { mediaService } = this.injected;
    mediaService!.changePanoptoCdoProps(name, value);
  }

  onSearch() {
    //
    this.findPanoptoList();
  }

  onChangeQueryProps(name: string, value: string) {
    const { mediaService, collegeService } = this.injected;
    const { collegeForPanopto } = collegeService;
    if (mediaService) {
      mediaService?.changePanoptoCdoProps(name, value);
      if (value != '전체') {
        mediaService?.changePanoptoCdoProps('folderId', collegeForPanopto.panoptoFolderId);
      } else {
        mediaService?.changePanoptoCdoProps('folderId', '');
      }
    }
  }

  onClickTranscriptAdd() {
    const { transcriptService } = this.injected;

    transcriptService?.addTranscript();
  }

  onClickTranscriptRemove(idx: number) {
    const { transcriptService } = this.injected;

    transcriptService?.removeTranscript(idx);
  }

  changeFormat(time: number) {
    const intTime = parseInt(time.toString());
    let hour = '00';
    let minute = '00';
    let second = '00';
    let returnTime = hour + ':' + minute + ':' + second;

    const calcTime = time / 60;

    if (intTime && intTime > 0) {
      if (calcTime < 1) {
        returnTime = hour + ':' + minute + ':' + this.addZero(intTime);
      } else if (calcTime >= 1 && calcTime < 60) {
        minute = this.addZero(parseInt(calcTime.toString()));
        second = this.addZero(parseInt((time % 60).toString()));
        returnTime = hour + ':' + minute + ':' + second;
      } else {
        hour = (calcTime / 60).toString();
        const calcMinute = intTime - parseInt(hour) * 60 * 60;
        minute = this.addZero(parseInt((calcMinute / 60).toString()));
        hour = this.addZero(parseInt(hour));
        second = this.addZero(parseInt((calcMinute % 60).toString()));
        returnTime = hour + ':' + minute + ':' + second;
      }
    }

    return returnTime;
  }

  changeDateFormat(startTime: string) {
    return (startTime && moment(startTime).format('YYYY-MM-DD')) || '-';
  }

  addZero(num: number) {
    if (num < 10 && num >= 0) {
      return '0' + num;
    } else {
      return num.toString();
    }
  }

  render() {
    const { panoptos, panopto: selectedPanopto, panoptoCdo } = this.injected.mediaService;
    const { pageMap } = this.injected.sharedService;
    const { transcriptService } = this.injected;

    const { pageIndex } = this.state;
    const { uploadFile, removeDeliveryIdLocale, changePanoptoId, changeLanguage } = this.props;
    const results = panoptos && panoptos.results;
    const totalCount = panoptos && panoptos.totalCount;

    const list = this.state.list;

    //transcriptService!.changeTotalCount(list.length);

    return (
      <>
        <Container fluid>
          <div>
            <Breadcrumb icon="right angle" sections={SelectType.TranscriptSections} />
            <Header as="h2">Transcript 관리</Header>
          </div>
          <Modal.Content>
            <SearchBox
              onSearch={this.onSearch}
              onChangeQueryProps={this.onChangeQueryProps}
              queryModel={panoptoCdo}
              searchWordOption={SelectType.searchWordForCommunityNotAll}
              defaultPeriod={2}
            />
            {/* <Segment>
                <Form className="search-box">
                  <Grid>
                    <Grid.Row>
                      <Grid.Column width={16}>
                        <Form.Group inline>
                          <label style={{ minWidth: "80px" }}>등록일자</label>
                          <Form.Field>
                            <div className="ui input right icon">
                              <DatePicker
                                placeholderText="시작날짜를 선택해주세요."
                                selected={
                                  (panoptoCdo &&
                                    panoptoCdo.period &&
                                    panoptoCdo.period.startDateObj) ||
                                  ''
                                }
                                onChange={(date: Date) =>
                                  this.setPeriodProps(
                                    'period.startDateMoment',
                                    moment(date)
                                  )
                                }
                                dateFormat="yyyy.MM.dd"
                                maxDate={moment().toDate()}
                              />
                              <Icon name="calendar alternate outline" />
                            </div>
                          </Form.Field>
                          <div className="dash">-</div>
                          <Form.Field>
                            <div className="ui input right icon">
                              <DatePicker
                                placeholderText="종료날짜를 선택해주세요."
                                selected={
                                  (panoptoCdo &&
                                    panoptoCdo.period &&
                                    panoptoCdo.period.endDateObj) ||
                                  ''
                                }
                                onChange={(date: Date) =>
                                  this.setPeriodProps(
                                    'period.endDateMoment',
                                    moment(date)
                                  )
                                }
                                minDate={
                                  panoptoCdo &&
                                  panoptoCdo.period &&
                                  panoptoCdo.period.startDateObj
                                }
                                dateFormat="yyyy.MM.dd"
                                maxDate={moment().toDate()}
                              />
                              <Icon name="calendar alternate outline" />
                            </div>
                          </Form.Field>
                        </Form.Group>
                        <Form.Group inline>
                          <label style={{ minWidth: '80px' }}>폴더선택</label>
                          <Form.Field
                            control={Select}
                            options={collegeSelect}
                            value={(panoptoCdo && panoptoCdo.college) || '전체'}
                            onChange={(e: any, data: any) => this.selectCollege('college', data.value)}
                          />
                        </Form.Group>
                        <Form.Group inline>
                          <label style={{ minWidth: '80px' }}>파일명</label>
                          <Form.Field
                            control={Input}
                            width={10}
                            placeholder="파일명을 입력해주세요."
                            value={(panoptoCdo && panoptoCdo.sessionName) || ''}
                            onChange={(e: any, data: any) => this.onChangePanoptoFileName('sessionName', data.value)}
                          />
                        </Form.Group>
                      </Grid.Column>
                      <Grid.Column width={16}>
                        <div className="center">
                          <Button primary onClick={this.onSearch}>
                            검색
                          </Button>
                        </div>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Form>
              </Segment> */}
            <Grid className="list-info">
              <Grid.Row>
                <Grid.Column width={16}>
                  {(totalCount && (
                    <span>
                      {' '}
                      전체 <strong>{totalCount}</strong>개{' '}
                    </span>
                  )) ||
                    ''}
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <Loader>
              <Form>
                <Table celled>
                  <colgroup>
                    <col width="3%" />
                    <col width="24%" />
                    <col width="5%" />
                    <col width="5%" />
                    <col width="5%" />
                    <col width="5%" />
                    <col width="5%" />
                    <col width="5%" />
                  </colgroup>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
                      <Table.HeaderCell textAlign="center">영상명</Table.HeaderCell>
                      <Table.HeaderCell textAlign="center">Category</Table.HeaderCell>
                      <Table.HeaderCell textAlign="center">재생시간</Table.HeaderCell>
                      <Table.HeaderCell textAlign="center">등록일자</Table.HeaderCell>
                      <Table.HeaderCell textAlign="center">등록여부</Table.HeaderCell>
                      <Table.HeaderCell textAlign="center">재생</Table.HeaderCell>
                      <Table.HeaderCell textAlign="center">관리</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    {(results &&
                      results.length &&
                      results.map((panopto, index) => (
                        <Table.Row key={index}>
                          <Table.Cell textAlign="center">{totalCount - index - pageIndex}</Table.Cell>
                          <Table.Cell>{panopto.name}</Table.Cell>
                          <Table.Cell textAlign="center">{panopto.folderName}</Table.Cell>
                          <Table.Cell textAlign="center">{this.changeFormat(panopto.duration)}</Table.Cell>
                          <Table.Cell textAlign="center">{this.changeDateFormat(panopto.startTime)}</Table.Cell>
                          <Table.Cell textAlign="center">{panopto.transcriptExists ? 'Y' : 'N'}</Table.Cell>
                          <Table.Cell textAlign="center">
                            <Button
                              type="button"
                              onClick={() => {
                                {
                                  this.goToVieo(panopto.viewUrl);
                                }
                              }}
                            >
                              Play
                            </Button>
                          </Table.Cell>
                          {/* <Table.Cell textAlign="center">
                              <Button
                                type="button"
                                onClick={() => {
                                  if (this.fileInputRef && this.fileInputRef.current) {
                                    this.fileInputRef.current.click();
                                    changePanoptoId(panopto.panoptoSessionId);
                                  }
                                }}
                              >
                                자막
                              </Button>
                              <input
                                id="file"
                                type="file"
                                ref={this.fileInputRef}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                  e.target.files && uploadFile(e.target.files[0]);
                                }}
                                hidden
                              />
                            </Table.Cell> */}
                          <Table.Cell textAlign="center">
                            <TranscriptManageModal
                              onClickTranscriptAdd={this.onClickTranscriptAdd}
                              onClickTranscriptRemove={this.onClickTranscriptRemove}
                              deliveryId={panopto.panoptoSessionId}
                              panoptoName={panopto.name}
                              panoptoDuration={this.changeFormat(panopto.duration)}
                              uploadFile={uploadFile}
                              removeDeliveryIdLocale={removeDeliveryIdLocale}
                              changePanoptoId={changePanoptoId}
                              changeLanguage={changeLanguage}
                            />
                          </Table.Cell>
                        </Table.Row>
                      ))) || (
                      <Table.Row>
                        <Table.Cell textAlign="center" colSpan={7}>
                          <div className="no-cont-wrap no-contents-icon">
                            <Icon className="no-contents80" />
                            <div className="sr-only">콘텐츠 없음</div>
                            <div className="text">검색 결과를 찾을 수 없습니다.</div>
                          </div>
                        </Table.Cell>
                        {/* <Table.Cell textAlign="center">
                              <TranscriptManageModal
                                transcriptService={transcriptService}
                                // list={list}
                                onClickTranscriptAdd={this.onClickTranscriptAdd}
                                onClickTranscriptRemove={this.onClickTranscriptRemove}
                                deliveryId="142ab685-27b1-4cda-8b34-ac3e0060cdc0"
                                uploadFile={uploadFile}
                                changePanoptoId={changePanoptoId}
                                changeLanguage={changeLanguage}
                              />
                            </Table.Cell> */}
                      </Table.Row>
                    )}
                  </Table.Body>
                </Table>
                {totalCount === 0 ? null : (
                  <div className="center">
                    <Pagination
                      activePage={pageMap.get('panopto') ? pageMap.get('panopto').page : 1}
                      totalPages={pageMap.get('panopto') ? pageMap.get('panopto').totalPages : 1}
                      onPageChange={(e, data) => this.findPanoptoList(data.activePage as number)}
                    />
                  </div>
                )}
              </Form>
            </Loader>
          </Modal.Content>
        </Container>
      </>
    );
  }
}

export default TranscriptFormListView;
