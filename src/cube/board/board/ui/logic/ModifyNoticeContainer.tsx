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
  Input,
  Radio,
  Select,
  Table,
} from 'semantic-ui-react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { inject, observer } from 'mobx-react';
import DatePicker from 'react-datepicker';
import moment, { Moment } from 'moment';

import { FileBox, PatronType, ValidationType } from '@nara.drama/depot';

import { PolyglotModel, SelectType } from 'shared/model';
import { Polyglot } from 'shared/components';
import {
  getDefaultLanguage,
  getPolyglotToAnyString,
  isPolyglotBlank,
  PolyglotService,
} from 'shared/components/Polyglot';
import { CrossEditorService } from 'shared/components/CrossEditor';
import { ConfirmWin, AlertWin, DepotUtil } from 'shared/ui';

import PostService from '../../../post/present/logic/PostService';
import { PostModel } from '../../../post/model/PostModel';
import { serviceManagementUrl } from '../../../../../Routes';

import { PostCloseOption } from 'cube/board/post/model/PostCloseOption';
import { ExposureType } from '../../../post/model/vo/ExposureType';
import { PostContentsContentsModel } from '../../../post/model/PostContentsContentsModel';
import { PostContentsModel } from '../../../post/model/PostContentsModel';

interface Props extends RouteComponentProps<{ cineroomId: string; postId: string }> {}

interface States {
  alertWinOpen: boolean;
  confirmWinOpen: boolean;
  isBlankTarget: string;
  alertIcon: string;
  type: string;
  title: string;
  filesMap: Map<string, any>;
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
class ModifyNoticeContainer extends ReactComponent<Props, States, Injected> {
  //
  crossEditorIdPC = 'postModifiedPC';
  crossEditorIdMO = 'postModifiedMO';

  constructor(props: Props) {
    super(props);
    this.state = {
      alertWinOpen: false,
      confirmWinOpen: false,
      isBlankTarget: '',
      alertIcon: '',
      type: '',
      title: '',
      filesMap: new Map<string, any>(),
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

  async init() {
    const { postService } = this.injected;
    const { postId } = this.props.match.params;
    await postService.findPostByPostId(postId);

    this.setPostContents();
  }

  setPostContents() {
    //
    const { post } = this.injected.postService;

    console.log(post.contents);

    post.contents.contents.forEach((content) => {
      if (content.exposureType === 'PC') {
        this.setState({ usePc: true, pcContents: new PolyglotModel(content.contents) });
      } else if (content.exposureType === 'Mobile') {
        this.setState({ useMobile: true, moContents: new PolyglotModel(content.contents) });
      }
    });
  }

  onChangerContentsProps(name: string, value: string | PolyglotModel) {
    //
    const { postService } = this.injected;
    if (name === 'title' && value.length > 51) {
      alert('제목은 50자를 넘을 수 없습니다.');
    }
    if (postService) postService.changePostProps(name, value);
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

  handleOKConfirmWin() {
    //
    const { postService } = this.injected;
    const { postId } = this.props.match.params;
    const { post } = postService;
    Promise.resolve()
      .then(() => postService && postService.modifyPost(postId, post))
      .then(() => this.routeToPostList());
  }

  onChangePostPeriodProps(name: string, value: Moment) {
    //
    const { postService } = this.injected;
    if (name === 'period.startDateMoment') postService!.changePostPeriodProps(name, value.startOf('day'));
    if (name === 'period.endDateMoment') postService!.changePostPeriodProps(name, value.endOf('day'));
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

  render() {
    const { postService } = this.injected;
    const { post } = postService;
    const { alertWinOpen, isBlankTarget, confirmWinOpen, alertIcon, type, title, filesMap } = this.state;
    return (
      <Container fluid>
        <div>
          <Breadcrumb icon="right angle" sections={SelectType.sectionForCreateNotice} />
          <Header as="h2">공지사항 관리</Header>
        </div>
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
                      placeholder="Please enter the notice title."
                      value={(post && post.title) || ''}
                      onChange={(e: any) => this.onChangerContentsProps('title', e.target.value)}
                    />*/}
                    <Polyglot.Input
                      languageStrings={post.title}
                      name="title"
                      onChangeProps={this.onChangerContentsProps}
                      placeholder="공지사항 제목을 입력해주세요."
                    />
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell className="tb-header">
                    공지 구분 <span className="required">*</span>
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
                        />

                        {(postService && postService.post.pinned && (
                          <>
                            <Form.Field>
                              <div className="ui input right icon">
                                <DatePicker
                                  placeholderText="시작날짜를 선택해주세요."
                                  selected={(post && post.period && post.period.startDateObj) || ''}
                                  onChange={(date: Date) =>
                                    this.onChangePostPeriodProps('period.startDateMoment', moment(date))
                                  }
                                  minDate={moment().toDate()}
                                  dateFormat="yyyy.MM.dd"
                                />
                                <Icon name="calendar alternate outline" />
                              </div>
                            </Form.Field>
                            <div className="dash">-</div>
                            <Form.Field>
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
                          </>
                        )) ||
                          ''}
                      </Form.Group>
                    )}
                    {(postService && postService.post.pinned && (
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
                      ''}
                  </Table.Cell>
                </Table.Row>
                {this.state.usePc && (
                  <Table.Row>
                    <Table.Cell className="tb-header">
                      PC 공지사항 내용 <span className="required">*</span>
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
                      Mobile 공지사항 내용 <span className="required">*</span>
                    </Table.Cell>
                    <Table.Cell>
                      <Polyglot.CrossEditor
                        id={this.crossEditorIdMO}
                        name="contents.contents.mo"
                        onChangeProps={(_, value) => this.onChangeContents(value, 'Mobile')}
                        languageStrings={this.state.moContents}
                      />
                    </Table.Cell>
                  </Table.Row>
                )}
                <Table.Row>
                  <Table.Cell className="tb-header">첨부파일</Table.Cell>
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
                        {/*<div>
                          {(filesMap &&
                            filesMap.get('reference') &&
                            filesMap.get('reference').map((foundedFile: DepotFileViewModel, index: number) => (
                              <p key={index}>
                                <a onClick={() => depot.downloadDepotFile(foundedFile.id)}>{foundedFile.name}</a>
                              </p>
                            ))) ||
                            '-'}
                            </div>*/}
                      </div>
                    </div>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell className="tb-header">작성자 및 조회수</Table.Cell>
                  <Table.Cell>
                    {post.writer && getPolyglotToAnyString(post.writer.name, getDefaultLanguage(post.langSupports))}{' '}
                    &nbsp;|&nbsp; {this.changeDateToString(new Date(post.registeredTime))}&nbsp;
                    {post.registeredTime &&
                      new Date(post.registeredTime).toLocaleTimeString('en-GB').substring(0, 5)}{' '}
                    &nbsp;|&nbsp; {post.readCount} View
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
          message="수정하시겠습니까?"
          open={confirmWinOpen}
          handleClose={this.handleCloseConfirmWin}
          handleOk={this.handleOKConfirmWin}
          title="저장 안내"
          buttonYesName="수정"
          buttonNoName="취소"
        />
      </Container>
    );
  }
}

export default withRouter(ModifyNoticeContainer);
