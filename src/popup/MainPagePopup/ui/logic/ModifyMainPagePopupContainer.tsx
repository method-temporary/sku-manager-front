import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Breadcrumb, Button, Container, Form, Header, Radio, Table } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import { reactAutobind } from '@nara.platform/accent';

import { SelectType } from 'shared/model';
import Polyglot from 'shared/components/Polyglot';
import { AlertWin, ConfirmWin } from 'shared/ui';

import { displayManagementUrl } from '../../../../Routes';
import MainPagePopupService from '../../present/logic/MainPagePopupService';
import MainPagePopupModel from '../../model/MainPagePopupModel';

interface Props extends RouteComponentProps<{ cineroomId: string; popupId: string }> {
  mainPagePopupService?: MainPagePopupService;
}

interface States {
  alertWinOpen: boolean;
  confirmWinOpen: boolean;
  isBlankTarget: string;
  alertIcon: string;
  type: string;
  title: string;
}

@inject('mainPagePopupService')
@observer
@reactAutobind
class ModifyMainPagePopupContainer extends React.Component<Props, States> {
  //
  constructor(props: Props) {
    super(props);
    this.state = {
      alertWinOpen: false,
      confirmWinOpen: false,
      isBlankTarget: '',
      alertIcon: '',
      type: '',
      title: '',
    };
  }

  componentDidMount() {
    //
    const { mainPagePopupService } = this.props;
    const { popupId } = this.props.match.params;
    if (mainPagePopupService) {
      mainPagePopupService.findMainPagePopup(popupId);
    }
  }

  onChangerContentsProps(name: string, value: string) {
    //
    const { mainPagePopupService } = this.props;
    if (name === 'title' && value.length > 51) {
      alert('제목은 50자를 넘을 수 없습니다.');
    }
    if (mainPagePopupService) mainPagePopupService.changeMainPagePopupProp(name, value);
  }

  routeToMainPagePopupList() {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${displayManagementUrl}/popup/mainPagePopup`
    );
  }

  handleCloseAlertWin() {
    //
    this.setState({
      alertWinOpen: false,
    });
  }

  handleCloseConfirmWin() {
    //
    this.setState({
      confirmWinOpen: false,
    });
  }

  handleOKConfirmWin() {
    //
    const { mainPagePopupService } = this.props;
    const { mainPagePopup } = this.props.mainPagePopupService || ({} as MainPagePopupService);
    Promise.resolve()
      .then(
        () => mainPagePopupService && mainPagePopupService.modifyMainPagePopup(MainPagePopupModel.asUdo(mainPagePopup))
      )
      .then(() => this.routeToMainPagePopupList());
  }

  handleSave() {
    //
    const { mainPagePopup } = this.props.mainPagePopupService || ({} as MainPagePopupService);
    if (MainPagePopupModel.isBlankForMainPage(mainPagePopup) === 'success') {
      this.setState({ confirmWinOpen: true });
    } else {
      this.setState({
        isBlankTarget: MainPagePopupModel.isBlankForMainPage(mainPagePopup),
        alertWinOpen: true,
      });
    }
  }

  handleOk() {
    //
  }

  changeDateToString(date: Date) {
    //
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    const year = date.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    return [year, month, day].join('.');
  }

  render() {
    const { mainPagePopup, changeMainPagePopupProp, onChangeMainPagePopupPeriodProps } =
      this.props.mainPagePopupService || ({} as MainPagePopupService);
    const { alertWinOpen, isBlankTarget, confirmWinOpen, alertIcon, type, title } = this.state;
    return (
      <Container fluid>
        <Polyglot languages={mainPagePopup.langSupports}>
          <div>
            <Breadcrumb icon="right angle" sections={SelectType.sectionForCreateNotice} />
            <Header as="h2">팝업 관리</Header>
          </div>
          <Form>
            <Table celled>
              <colgroup>
                <col width="20%" />
                <col width="80%" />
              </colgroup>

              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell colSpan={2} className="title-header">
                    팝업 정보
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                <Table.Row>
                  <Table.Cell className="tb-header">지원 언어</Table.Cell>
                  <Table.Cell>
                    <Polyglot.Languages onChangeProps={this.onChangerContentsProps} />
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell className="tb-header">기본 언어</Table.Cell>
                  <Table.Cell>
                    <Polyglot.Default onChangeProps={this.onChangerContentsProps} />
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell className="tb-header">제목</Table.Cell>
                  <Table.Cell>
                    <Polyglot.Input
                      languageStrings={mainPagePopup.title}
                      name="title"
                      onChangeProps={this.onChangerContentsProps}
                    />
                    {/* <Form.Field*/}
                    {/*  control={Input}*/}
                    {/*  placeholder="Please enter the popup title."*/}
                    {/*  // maxLength={51}*/}
                    {/*  value={(mainPagePopup && mainPagePopup.title) || ''}*/}
                    {/*  onChange={(e: any) => this.onChangerContentsProps('title', e.target.value)}*/}
                    {/*/>*/}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell className="tb-header">활성 / 비활성</Table.Cell>
                  <Table.Cell>
                    <Form.Group>
                      <Form.Field
                        control={Radio}
                        label="활성"
                        value={true}
                        checked={mainPagePopup && mainPagePopup.open}
                        onChange={(e: any, data: any) => changeMainPagePopupProp('open', data.value)}
                      />
                      <Form.Field
                        control={Radio}
                        label="비활성"
                        value={false}
                        checked={mainPagePopup && !mainPagePopup.open}
                        onChange={(e: any, data: any) => changeMainPagePopupProp('open', data.value)}
                      />
                    </Form.Group>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>게시기간</Table.Cell>
                  <Table.Cell>
                    <Form.Group>
                      <>
                        <Form.Field className="date-inline">
                          <DatePicker
                            placeholderText="시작날짜를 선택해주세요."
                            selected={
                              (mainPagePopup && mainPagePopup.period && mainPagePopup.period.startDateObj) || ''
                            }
                            onChange={(date: Date) =>
                              onChangeMainPagePopupPeriodProps('period.startDateMoment', moment(date))
                            }
                            showTimeSelect
                            timeFormat="HH"
                            timeIntervals={60}
                            dateFormat="yyyy.MM.dd : HH"
                          />
                          <i aria-hidden="true" className="calendar alternate outline icon" />
                          <div className="dash">-</div>
                          <DatePicker
                            placeholderText="마지막날짜를 선택해주세요."
                            selected={(mainPagePopup && mainPagePopup.period && mainPagePopup.period.endDateObj) || ''}
                            onChange={(date: Date) =>
                              onChangeMainPagePopupPeriodProps('period.endDateMoment', moment(date))
                            }
                            showTimeSelect
                            timeFormat="HH"
                            timeIntervals={60}
                            dateFormat="yyyy.MM.dd : HH"
                          />
                          <i aria-hidden="true" className="calendar alternate outline icon" />
                        </Form.Field>
                      </>
                    </Form.Group>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    내용
                    <br />
                    이미지 사이즈 1000px X 640px
                  </Table.Cell>
                  <Table.Cell>
                    {/*<Editor*/}
                    {/*  popup={mainPagePopup}*/}
                    {/*  value={(mainPagePopup && mainPagePopup.contents && mainPagePopup.contents) || ''}*/}
                    {/*  onChangeContentsProps={this.onChangerContentsProps}*/}
                    {/*/>*/}
                    <Polyglot.Editor
                      name="contents"
                      languageStrings={mainPagePopup.contents}
                      onChangeProps={this.onChangerContentsProps}
                    />
                  </Table.Cell>
                </Table.Row>
                {/*
              <Table.Row>
                <Table.Cell>작성자 및 조회수</Table.Cell>
                <Table.Cell>
                  {mainPagePopup.writer && mainPagePopup.writer.name} &nbsp;|&nbsp; {this.changeDateToString(new Date(mainPagePopup.time))}&nbsp;
                  {mainPagePopup.time && new Date(mainPagePopup.time).toLocaleTimeString('en-GB').substring(0, 5)} &nbsp;|&nbsp;{' '}
                  {mainPagePopup.readCount} View
                </Table.Cell>
              </Table.Row>
*/}
              </Table.Body>
            </Table>
          </Form>
          <div className="fl-right btn-group">
            <Button onClick={this.routeToMainPagePopupList} type="button">
              목록
            </Button>
            <Button primary onClick={this.handleSave} type="button">
              저장
            </Button>
          </div>
          <AlertWin
            message={isBlankTarget}
            handleClose={this.handleCloseAlertWin}
            handleOk={this.handleOk}
            open={alertWinOpen}
            alertIcon={alertIcon}
            type={type}
            title={title}
          />
          <ConfirmWin
            message="수정하시겠습니까?"
            open={confirmWinOpen}
            handleClose={this.handleCloseConfirmWin}
            handleOk={this.handleOKConfirmWin}
            title="저장 안내"
            buttonYesName="수정"
            buttonNoName="취소"
          />
        </Polyglot>
      </Container>
    );
  }
}

export default withRouter(ModifyMainPagePopupContainer);
