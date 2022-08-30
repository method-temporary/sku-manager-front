import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import {
  Breadcrumb,
  Button,
  Checkbox,
  Container,
  Form,
  Header,
  Icon,
  InputOnChangeData,
  Radio,
  Select,
  Table,
} from 'semantic-ui-react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { patronInfo } from '@nara.platform/dock';
import { inject, observer } from 'mobx-react';
import DatePicker from 'react-datepicker';
import moment, { Moment } from 'moment';

import { FileBox, PatronType, ValidationType } from '@nara.drama/depot';

import { PolyglotModel, SelectType } from 'shared/model';
import { Polyglot, RadioGroup } from 'shared/components';
import { PolyglotService, Language, isPolyglotBlank } from 'shared/components/Polyglot';
import { CrossEditorService } from 'shared/components/CrossEditor';
import { DepotUtil, ConfirmWin, AlertWin } from 'shared/ui';

import { OpenState } from '../../../post/model/OpenState';
import PostService from '../../../post/present/logic/PostService';
import { serviceManagementUrl } from '../../../../../Routes';
import { PostModel } from '../../../post/model/PostModel';
import { PostCloseOption } from '../../../post/model/PostCloseOption';
import { initNoticePostContents, PostContentsModel } from '../../../post/model/PostContentsModel';
import { ExposureType } from '../../../post/model/vo/ExposureType';
import { PostContentsContentsModel } from '../../../post/model/PostContentsContentsModel';

interface Props extends RouteComponentProps<{ cineroomId: string }> {}

interface States {
  alertWinOpen: boolean;
  confirmWinOpen: boolean;
  isBlankTarget: string;
  alertIcon: string;
  type: string;
  title: string;
  usePc: boolean;
  pcContents: PolyglotModel;
  useMobile: boolean;
  moContents: PolyglotModel;
}

interface Injected {
  postService: PostService;
  crossEditorService: CrossEditorService;
  polyglotService: PolyglotService;
}

@inject('postService', 'crossEditorService', 'polyglotService')
@observer
@reactAutobind
class CreateNoticeContainer extends ReactComponent<Props, States, Injected> {
  //
  crossEditorIdPC = 'postCreatePC';
  crossEditorIdMO = 'postCreateMO';

  constructor(props: Props) {
    super(props);
    this.state = {
      alertWinOpen: false,
      confirmWinOpen: false,
      isBlankTarget: '',
      alertIcon: '',
      type: '',
      title: '',
      usePc: true,
      pcContents: new PolyglotModel(),
      useMobile: false,
      moContents: new PolyglotModel(),
    };
  }

  componentDidMount() {
    //
    this.init();
  }

  init() {
    //
    const { postService } = this.injected;
    const names = JSON.parse(patronInfo.getPatronName() || '') || '';
    const email = patronInfo.getPatronEmail() || '';
    const companyCode = patronInfo.getPatronCompanyCode() || '';
    if (postService) {
      postService.initPost();
      postService.changePostProps('boardId', 'NTC');
      //postService.changePostProps('writer.name', name);
      const copiedValue = new PolyglotModel(postService.post.writer.name);
      copiedValue.setValue(Language.En, names?.en);
      copiedValue.setValue(Language.Ko, names?.ko);
      copiedValue.setValue(Language.Zh, names?.zh);
      postService.changePostProps('writer.name', copiedValue);

      postService.changePostProps('contents', initNoticePostContents());

      postService.changePostProps('writer.employeeId', companyCode);
      postService.changePostProps('writer.email', email);
    }
  }

  onChangerContentsProps(name: string, value: string | PolyglotModel) {
    //
    const { postService } = this.injected;
    if (name === 'title' && value.length > 51) {
      alert('제목은 50자를 넘을 수 없습니다.');
    }
    if (postService) {
      postService.changePostProps(name, value);
    }
  }

  onChangeContents(value: PolyglotModel, type: ExposureType) {
    //
    if (type === 'PC') {
      //
      this.setState({ pcContents: value });
    } else {
      //
      this.setState({ moContents: value });
    }
  }

  routeToPostList() {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${serviceManagementUrl}/boards/notice-list`
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

  onChangePostPeriodProps(name: string, value: Moment) {
    //
    const { postService } = this.injected;
    if (name === 'period.startDateMoment') postService!.changePostPeriodProps(name, value.startOf('day'));
    if (name === 'period.endDateMoment') postService!.changePostPeriodProps(name, value.endOf('day'));
  }

  handleOKConfirmWin() {
    //
    const { postService } = this.injected;
    const { post } = postService;
    const names = JSON.parse(patronInfo.getPatronName() || '') || '';
    const email = patronInfo.getPatronEmail() || '';
    Promise.resolve()
      .then(() => {
        if (post.pinned) {
          this.onChangerContentsProps('openState', OpenState.Opened);
          //this.onChangerContentsProps('writer.name', name);
          const copiedValue = new PolyglotModel(post.writer.name);
          copiedValue.setValue(Language.En, names?.en);
          copiedValue.setValue(Language.Ko, names?.ko);
          copiedValue.setValue(Language.Zh, names?.zh);
          this.onChangerContentsProps('writer.name', copiedValue);
          this.onChangerContentsProps('writer.email', email);
        }
      })
      .then(() => (postService && postService.registerPost(post)) || null)
      .then(() => postService && postService.initPostContents())
      .then(() => this.routeToPostList());
  }

  handleOk() {
    //
    this.setState({ alertWinOpen: false });
  }

  handleSave() {
    //
    const { postService, crossEditorService, polyglotService } = this.injected;
    const { post, changePostProps } = postService;

    const postContents = post.contents;

    const postContentsContents: PostContentsContentsModel[] = [];

    if (this.state.usePc) {
      const crossEditorBodyValue = crossEditorService.getCrossEditorBodyValue(this.crossEditorIdPC);
      const currentLang = polyglotService.getActiveLan(this.crossEditorIdPC);

      if (currentLang) {
        const contents = this.state.pcContents;

        if (contents) {
          const copiedValue = new PolyglotModel(contents);
          copiedValue.setValue(currentLang, crossEditorBodyValue === '<p><br /></p>' ? '' : crossEditorBodyValue);

          if (isPolyglotBlank(post.langSupports, copiedValue)) {
            this.setState({
              isBlankTarget: 'PC 내용은 필수입력 항목입니다.',
              alertWinOpen: true,
            });

            return;
          } else {
            postContentsContents.push({ contents: copiedValue, exposureType: 'PC' } as PostContentsContentsModel);
          }
        }
      }
    }

    if (this.state.useMobile) {
      const crossEditorBodyValue = crossEditorService.getCrossEditorBodyValue(this.crossEditorIdMO);
      const currentLang = polyglotService.getActiveLan(this.crossEditorIdMO);

      if (currentLang) {
        const contents = this.state.moContents;

        if (contents) {
          const copiedValue = new PolyglotModel(contents);
          copiedValue.setValue(currentLang, crossEditorBodyValue === '<p><br /></p>' ? '' : crossEditorBodyValue);

          if (isPolyglotBlank(post.langSupports, copiedValue)) {
            this.setState({
              isBlankTarget: 'Mobile 내용은 필수입력 항목입니다.',
              alertWinOpen: true,
            });

            return;
          } else {
            postContentsContents.push({ contents: copiedValue, exposureType: 'Mobile' } as PostContentsContentsModel);
          }
        }
      }
    }

    changePostProps('contents', { ...postContents, contents: postContentsContents } as PostContentsModel);

    if (PostModel.isBlankForNotice(post) === 'success') {
      this.setState({ confirmWinOpen: true });
    } else {
      this.setState({
        isBlankTarget: PostModel.isBlankForNotice(post),
        alertWinOpen: true,
      });
    }
  }

  getFileBoxIdForReference(fileBoxId: string) {
    //
    const { postService } = this.injected;
    const { post } = postService || ({} as PostService);
    if (postService && post.contents) postService.changePostProps('contents.depotId', fileBoxId);
  }

  onClickViewType(check: boolean, type: ExposureType) {
    //
    if (type === 'PC') {
      this.setState({ usePc: !check });

      if (!check) this.setState({ pcContents: new PolyglotModel() });
    } else {
      this.setState({ useMobile: !check });
      if (!check) this.setState({ moContents: new PolyglotModel() });
    }
  }

  render() {
    const { post } = this.injected.postService;
    const { alertWinOpen, isBlankTarget, confirmWinOpen, alertIcon, type, title } = this.state;

    return (
      <Container fluid>
        <div>
          <Breadcrumb icon="right angle" sections={SelectType.sectionForCreateNotice} />
          <Header as="h2">공지사항 관리</Header>
        </div>
        <div className="content">
          <Form>
            <Polyglot languages={post.langSupports}>
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
                    <Table.Cell className="tb-header">노출 설정</Table.Cell>
                    <Table.Cell>
                      <Form.Group>
                        <Form.Field
                          label="PC"
                          control={Checkbox}
                          checked={this.state.usePc}
                          onChange={() => this.onClickViewType(this.state.usePc, 'PC')}
                        />
                        <Form.Field
                          label="Mobile"
                          control={Checkbox}
                          checked={this.state.useMobile}
                          onChange={() => this.onClickViewType(this.state.useMobile, 'Mobile')}
                        />
                      </Form.Group>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="tb-header">
                      지원 언어 <span className="required">*</span>
                    </Table.Cell>
                    <Table.Cell>
                      <Polyglot.Languages onChangeProps={this.onChangerContentsProps} />
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="tb-header">
                      기본 언어 <span className="required">*</span>
                    </Table.Cell>
                    <Table.Cell>
                      <Polyglot.Default onChangeProps={this.onChangerContentsProps} />
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="tb-header">
                      제목 <span className="required">*</span>
                    </Table.Cell>
                    <Table.Cell>
                      {/*<Form.Field
                        control={Input}
                        placeholder="제목을 입력해주세요."
                        // maxLength={51}
                        value={(post && post.title) || ''}
                        onChange={(e: any) => this.onChangerContentsProps('title', e.target.value)}
                      />*/}
                      <Polyglot.Input
                        languageStrings={post.title}
                        name="title"
                        onChangeProps={this.onChangerContentsProps}
                        placeholder="제목을 입력해주세요."
                      />
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="tb-header">
                      공지 구분<span className="required">*</span>
                    </Table.Cell>
                    <Table.Cell>
                      {this.state.useMobile ? (
                        <>일반</>
                      ) : (
                        <Form.Group>
                          <Form.Field
                            control={Select}
                            placeholder="Select"
                            options={SelectType.noticeTypeForCreateNotice}
                            value={post && post.pinned}
                            onChange={(e: any, data: any) => {
                              this.onChangerContentsProps('pinned', data.value);
                            }}
                            disabled={this.state.useMobile}
                          />
                          {(post && post.pinned && (
                            <Form.Field className="date-inline">
                              <div className="ui input right icon">
                                <DatePicker
                                  placeholderText="시작날짜를 선택해주세요."
                                  selected={(post && post.period && post.period.startDateObj) || ''}
                                  onChange={(date: Date) =>
                                    this.onChangePostPeriodProps('period.startDateMoment', moment(date))
                                  }
                                  minDate={new Date()}
                                  dateFormat="yyyy.MM.dd"
                                />
                                <Icon name="calendar alternate outline" />
                              </div>
                              <div className="dash">-</div>
                              <div className="ui input right icon">
                                <DatePicker
                                  placeholderText="마지막날짜를 선택해주세요."
                                  selected={(post && post.period && post.period.endDateObj) || ''}
                                  onChange={(date: Date) =>
                                    this.onChangePostPeriodProps('period.endDateMoment', moment(date))
                                  }
                                  minDate={(post && post.period && post.period.startDateObj) || ''}
                                  dateFormat="yyyy.MM.dd"
                                />
                                <Icon name="calendar alternate outline" />
                              </div>
                            </Form.Field>
                          )) ||
                            (post &&
                              !post.pinned &&
                              (this.onChangePostPeriodProps('period.startDateMoment', moment()),
                              this.onChangePostPeriodProps('period.endDateMoment', moment())))}
                        </Form.Group>
                      )}
                      {(post && post.pinned && (
                        <Form.Group>
                          <Form.Field
                            control={Radio}
                            label="오늘 하루 그만 보기"
                            value={PostCloseOption.NotToday}
                            checked={post.closeOption === PostCloseOption.NotToday}
                            onChange={(e: any, data: any) => this.onChangerContentsProps('closeOption', data.value)}
                          />
                          <Form.Field
                            control={Radio}
                            label="앞으로 그만 보기"
                            value={PostCloseOption.NotForward}
                            checked={post.closeOption === PostCloseOption.NotForward}
                            onChange={(e: any, data: any) => this.onChangerContentsProps('closeOption', data.value)}
                          />
                        </Form.Group>
                      )) ||
                        (post && !post.pinned && this.onChangerContentsProps('closeOption', PostCloseOption.NotToday))}
                    </Table.Cell>
                  </Table.Row>
                  {this.state.usePc && (
                    <Table.Row>
                      <Table.Cell className="tb-header">
                        PC 공지사항 내용<span className="required">*</span>
                      </Table.Cell>
                      <Table.Cell>
                        <Polyglot.CrossEditor
                          id={this.crossEditorIdPC}
                          name="contents.contents.pc"
                          onChangeProps={(_, value) => this.onChangeContents(value, 'PC')}
                          languageStrings={this.state.pcContents}
                        />
                      </Table.Cell>
                    </Table.Row>
                  )}
                  {this.state.useMobile && (
                    <Table.Row>
                      <Table.Cell className="tb-header">
                        Mobile 공지사항 내용<span className="required">*</span>
                      </Table.Cell>
                      <Table.Cell>
                        <Polyglot.CrossEditor
                          id={this.crossEditorIdMO}
                          name="contents.contents.mobile"
                          onChangeProps={(_, value) => this.onChangeContents(value, 'Mobile')}
                          languageStrings={this.state.moContents}
                        />
                      </Table.Cell>
                    </Table.Row>
                  )}
                  <Table.Row>
                    <Table.Cell className="tb-header">파일첨부</Table.Cell>
                    <Table.Cell>
                      <div className="lg-attach">
                        <div className="attach-inner">
                          <FileBox
                            id={post.contents.depotId}
                            vaultKey={{ keyString: 'sku-depot', patronType: PatronType.Pavilion }}
                            patronKey={{ keyString: 'sku-denizen', patronType: PatronType.Denizen }}
                            validations={[
                              { type: ValidationType.Duplication, validator: DepotUtil.duplicationValidator },
                            ]}
                            onChange={(fileBoxId) => this.getFileBoxIdForReference(fileBoxId)}
                          />
                          <div className="bottom">
                            <span className="info-text1">
                              <Icon className="info16" />
                              <span className="blind">information</span>
                              <p>문서 및 이미지 파일을 업로드 가능합니다.</p>
                            </span>
                          </div>
                        </div>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Polyglot>
          </Form>
          <div className="fl-right btn-group">
            <Button onClick={this.routeToPostList} type="button">
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
      </Container>
    );
  }
}

export default withRouter(CreateNoticeContainer);
