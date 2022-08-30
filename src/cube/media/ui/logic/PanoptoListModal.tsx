import * as React from 'react';
import { Button, Modal, Form, Table, Pagination, Radio, Grid, Input, Segment, Icon } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';
import { MediaService } from '../../index';
import { InternalMediaConnectionModel } from '../../model/old/InternalMediaConnectionModel';
import { SharedService } from 'shared/present';
import { CubeType } from '../../../../personalcube/model/vo/CubeType';
import DatePicker from 'react-datepicker';
import moment, { Moment } from 'moment';

interface Props {
  mediaService?: MediaService;
  sharedService?: SharedService;
  cubeType: string;
  open: boolean;
  show: (open: boolean) => void;
}

@inject('mediaService', 'sharedService')
@observer
@reactAutobind
class PanoptoListModal extends React.Component<Props> {
  //

  componentDidMount() {
    const { mediaService } = this.props;

    const endDate = moment().endOf('day');
    let startDate = moment().startOf('day');
    startDate = moment().subtract(14, 'days').startOf('day');
    mediaService!.changePanoptoCdoProps('period.endDateMoment', endDate);
    mediaService!.changePanoptoCdoProps('period.startDateMoment', startDate);
  }

  findPanoptoList(page?: number) {
    const { sharedService, mediaService } = this.props;
    const { panoptoCdo } = this.props.mediaService || ({} as MediaService);
    if (sharedService && mediaService) {
      if (page) {
        sharedService.setPage('panopto', page);
        mediaService.changePanoptoCdoProps('currentPage', page);
      } else {
        sharedService.setPageMap('panopto', 0, Number(panoptoCdo.page_size));
      }
      mediaService.findPanoptoList().then((panoptos) => {
        if (panoptos.totalCount) sharedService.setCount('panopto', panoptos.totalCount);
        else sharedService.setCount('panopto', 0);
      });
    }
  }

  selectPanopto(panopto: InternalMediaConnectionModel) {
    const { mediaService } = this.props;
    if (mediaService) {
      panopto.viewUrl = panopto.viewUrl.replace('Viewer', 'Embed');
      mediaService.setPanoptoProps(panopto);
    }
  }

  handleOK() {
    const { mediaService } = this.props;
    const { panopto } = this.props.mediaService || ({} as MediaService);
    if (mediaService) {
      mediaService.changeMediaProps('mediaContents.internalMedias', [panopto]);
      this.show(false);
    }
  }

  handleCancel() {
    //
    this.show(false);
    this.onChangePanoptoFileName('searchQuery', '');
  }

  show(open: boolean) {
    //
    const { show } = this.props;
    show(open);
  }

  goToVieo(url: string) {
    //
    const viewerToEmbedViewURL = url.replace('Viewer', 'Embed');
    window.open(viewerToEmbedViewURL);
  }

  onChangePanoptoFileName(name: string, value: string) {
    //
    const { mediaService } = this.props;
    mediaService!.changePanoptoCdoProps(name, value);
  }

  onSearch() {
    //
    this.findPanoptoList();
  }

  setPeriodProps(name: string, value: Moment) {
    //
    const { mediaService } = this.props;

    if (name === 'period.startDateMoment') {
      if (isNaN(value.date())) {
        //mediaService!.changePanoptoCdoProps(name, null);
      } else {
        mediaService!.changePanoptoCdoProps(name, value.startOf('day'));
      }
    }
    if (name === 'period.endDateMoment') {
      if (isNaN(value.date())) {
        //mediaService!.changePanoptoCdoProps(name, null);
      } else {
        mediaService!.changePanoptoCdoProps(name, value.endOf('day'));
      }
    }
  }

  render() {
    const { panoptos, panopto: selectedPanopto, panoptoCdo } = this.props.mediaService || ({} as MediaService);
    const { open, show, cubeType } = this.props;
    const { pageMap } = this.props.sharedService || ({} as SharedService);
    const results = panoptos && panoptos.results;
    const totalCount = panoptos && panoptos.totalCount;
    return (
      <>
        <Modal size="large" open={open} onClose={() => show(false)}>
          <Modal.Header>{cubeType === CubeType.Video ? '동영상 선택' : '오디오 선택'}</Modal.Header>
          <Modal.Content>
            <Segment>
              <Form className="search-box">
                <Grid>
                  <Grid.Row>
                    <Grid.Column width={16}>
                      <Form.Group inline>
                        <label style={{ minWidth: '80px' }}>등록일자</label>
                        <Form.Field>
                          <div className="ui input right icon">
                            <DatePicker
                              placeholderText="시작날짜를 선택해주세요."
                              selected={(panoptoCdo && panoptoCdo.period && panoptoCdo.period.startDateObj) || ''}
                              onChange={(date: Date) => this.setPeriodProps('period.startDateMoment', moment(date))}
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
                              selected={(panoptoCdo && panoptoCdo.period && panoptoCdo.period.endDateObj) || ''}
                              onChange={(date: Date) => this.setPeriodProps('period.endDateMoment', moment(date))}
                              minDate={panoptoCdo && panoptoCdo.period && panoptoCdo.period.startDateObj}
                              dateFormat="yyyy.MM.dd"
                              maxDate={moment().toDate()}
                            />
                            <Icon name="calendar alternate outline" />
                          </div>
                        </Form.Field>
                        <label style={{ minWidth: '80px' }}>파일명</label>
                        <Form.Field
                          control={Input}
                          width={16}
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
            </Segment>
            <Form>
              <Table celled>
                <colgroup>
                  <col width="5%" />
                  <col width="50%" />
                  <col width="15%" />
                  <col width="15%" />
                  <col width="15%" />
                </colgroup>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell textAlign="center">Select</Table.HeaderCell>
                    <Table.HeaderCell>제목</Table.HeaderCell>
                    <Table.HeaderCell>재생시간</Table.HeaderCell>
                    <Table.HeaderCell>폴더명</Table.HeaderCell>
                    <Table.HeaderCell>재생</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {(results &&
                    results.length &&
                    results.map((panopto, index) => (
                      <Table.Row key={index}>
                        <Table.Cell textAlign="center">
                          <Form.Field
                            control={Radio}
                            onChange={() => this.selectPanopto(panopto)}
                            checked={selectedPanopto && selectedPanopto.panoptoSessionId === panopto.panoptoSessionId}
                          />
                        </Table.Cell>
                        <Table.Cell>{panopto.name}</Table.Cell>
                        <Table.Cell>{panopto.duration}</Table.Cell>
                        <Table.Cell>{panopto.folderName}</Table.Cell>
                        <Table.Cell>
                          <Button onClick={() => this.goToVieo(panopto.viewUrl)} type="button">
                            Play
                          </Button>
                        </Table.Cell>
                      </Table.Row>
                    ))) ||
                    null}
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
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={() => this.handleCancel()} type="button">
              Cancel
            </Button>
            <Button primary onClick={() => this.handleOK()} type="button">
              OK
            </Button>
          </Modal.Actions>
        </Modal>
      </>
    );
  }
}

export default PanoptoListModal;
