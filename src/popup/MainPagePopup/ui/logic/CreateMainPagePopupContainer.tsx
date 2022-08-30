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
import { MainPagePopupService } from '../../../index';
import MainPagePopupModel from '../../model/MainPagePopupModel';

interface Props extends RouteComponentProps<{ cineroomId: string }> {
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
class CreateMainPagePopupContainer extends React.Component<Props, States> {
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
    this.init();
  }

  init() {
    //
    const { mainPagePopupService } = this.props;
    if (mainPagePopupService) {
      mainPagePopupService.initMainPagePopup();
    }
  }

  onChangerContentsProps(name: string, value: string) {
    //
    const { mainPagePopupService } = this.props;
    if (name === 'title' && value.length > 51) {
      alert('제목은 50자를 넘을 수 없습니다.');
    }
    // console.log(name);
    // console.log(value);
    if (mainPagePopupService) mainPagePopupService.changeMainPagePopupProp(name, value);
  }

  // onChangerTime(name: string, value: string) {
  //   //period.setStartDateObj(new Date(20));
  // }

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
        () =>
          (mainPagePopupService &&
            mainPagePopupService.registerMainPagePopup(MainPagePopupModel.asCdo(mainPagePopup))) ||
          null
      )
      .then(() => this.routeToMainPagePopupList());
  }

  handleOk() {
    //
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

  render() {
    const { mainPagePopup, changeMainPagePopupProp, onChangeMainPagePopupPeriodProps } =
      this.props.mainPagePopupService || ({} as MainPagePopupService);
    const { alertWinOpen, isBlankTarget, confirmWinOpen, alertIcon, type, title } = this.state;
    // @ts-ignore
    return (
      <Container fluid>
        <Polyglot languages={mainPagePopup.langSupports}>
          <div>
            <Breadcrumb icon="right angle" sections={SelectType.mainPagePopup} />
            <Header as="h2">팝업 관리</Header>
          </div>
          <div className="content">
            <Form>
              <Table celled>
                <colgroup>
                  <col width="20%" />
                  <col width="80%" />
                </colgroup>

                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell colSpan={2} className="title-header">
                      공지사항 정보
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
                    <Table.Cell className="tb-header">게시 기간</Table.Cell>
                    <Table.Cell>
                      <Form.Group>
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
                      </Form.Group>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="tb-header">
                      내용 <br />
                      이미지 사이즈 1000px X 640px
                    </Table.Cell>
                    <Table.Cell>
                      {/*<Editor*/}
                      {/*  // id="notice-mainPagePopup-content"*/}
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
              message="저장하시겠습니까?"
              open={confirmWinOpen}
              handleClose={this.handleCloseConfirmWin}
              handleOk={this.handleOKConfirmWin}
              title="저장 안내"
              buttonYesName="저장"
              buttonNoName="취소"
            />
          </div>
        </Polyglot>
      </Container>
    );
  }
}

export default withRouter(CreateMainPagePopupContainer);
