import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Breadcrumb, Button, Container, Form, Header, Icon, Select, Table } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import DatePicker from 'react-datepicker';
import moment, { Moment } from 'moment';
import { serviceManagementUrl } from 'Routes';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { patronInfo } from '@nara.platform/dock';

import { SelectType, PolyglotModel } from 'shared/model';
import { Polyglot } from 'shared/components';
import { Language, getPolyglotToAnyString } from 'shared/components/Polyglot';
import { ConfirmWin, AlertWin } from 'shared/ui';

import { PostService } from '../../../../cube/board';
import { PostModel } from '../../../../cube/board/post/model/PostModel';
import { CategoryService } from '../../../category';
import { SupportType } from '../../../category/model/vo/SupportType';
import { FaqService } from '../../index';

interface Props extends RouteComponentProps<{ cineroomId: string }> {}

interface States {
  alertWinOpen: boolean;
  confirmWinOpen: boolean;
  isBlankTarget: string;
  alertIcon: string;
  type: string;
  title: string;
}

interface Injected {
  postService: PostService;
  faqService: FaqService;
  categoryService: CategoryService;
}

@inject('postService', 'categoryService')
@observer
@reactAutobind
class CreateFaqContainer extends ReactComponent<Props, States, Injected> {
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
    const { postService, faqService, categoryService } = this.injected;
    const names = JSON.parse(patronInfo.getPatronName() || '') || '';
    const email = patronInfo.getPatronEmail() || '';

    postService.initPost();
    postService.changePostProps('boardId', 'FAQ');
    //postService.changePostProps('writer.name', name);
    const copiedValue = new PolyglotModel(postService.post.writer.name);
    copiedValue.setValue(Language.En, names?.en);
    copiedValue.setValue(Language.Ko, names?.ko);
    copiedValue.setValue(Language.Zh, names?.zh);
    postService.changePostProps('writer.name', copiedValue);

    postService.changePostProps('writer.email', email);
    categoryService.findPrevAll(SupportType.FAQ);
  }

  onChangeContentsProps(name: string, value: string | PolyglotModel) {
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
      `/cineroom/${this.props.match.params.cineroomId}/${serviceManagementUrl}/supports/faq-list`
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
    const { post } = postService;
    const names = JSON.parse(patronInfo.getPatronName() || '') || '';
    const email = patronInfo.getPatronEmail() || '';
    Promise.resolve()
      .then(() => this.onChangeContentsProps('writer.email', email))
      //.then(() => this.onChangeContentsProps('writer.name', name))
      .then(() => {
        const copiedValue = new PolyglotModel(post.writer.name);
        copiedValue.setValue(Language.En, names?.en);
        copiedValue.setValue(Language.Ko, names?.ko);
        copiedValue.setValue(Language.Zh, names?.zh);
        this.onChangeContentsProps('writer.name', copiedValue);
      })
      .then(() => (postService && postService.registerPost(post)) || null)
      .then(() => postService && postService.initPostContents())
      .then(() => this.routeToPostList());
  }

  onChangePostPeriodProps(name: string, value: Moment) {
    //
    const { postService } = this.injected;
    if (name === 'period.startDateMoment') postService!.changePostPeriodProps(name, value.startOf('day'));
    if (name === 'period.endDateMoment') postService!.changePostPeriodProps(name, value.endOf('day'));
  }

  getStringStartDate(date: Date) {
    //
    const yyyy = date.getFullYear();
    const MM = date.getMonth();
    const dd = date.getDate();

    const resultDate = new Date(yyyy, MM, dd, 0, 0, 0).getTime();
    return resultDate;
  }

  getStringEndDate(date: Date) {
    //
    const yyyy = date.getFullYear();
    const MM = date.getMonth();
    const dd = date.getDate();

    const resultDate = new Date(yyyy, MM, dd, 23, 59, 59).getTime();
    return resultDate;
  }

  handleSave() {
    //
    const { post } = this.injected.postService;
    if (PostModel.isBlank(post) === 'success') {
      this.setState({ confirmWinOpen: true });
    } else {
      this.setState({
        isBlankTarget: PostModel.isBlank(post),
        alertWinOpen: true,
      });
    }
  }

  handleOk() {
    //
  }

  addCategoryList() {
    //
    const { categories } = this.injected.categoryService;
    const list: any = [];
    if (categories && categories.length) {
      categories.forEach((category, index) => {
        list.push({
          key: index,
          text: getPolyglotToAnyString(category.name),
          value: { id: category.id, name: category.name },
        });
      });
    }
    return list;
  }

  render() {
    const { post } = this.injected.postService;
    const { alertWinOpen, isBlankTarget, confirmWinOpen, alertIcon, type, title } = this.state;

    return (
      <Container fluid>
        <div>
          <Breadcrumb icon="right angle" sections={SelectType.sectionsForCreateFaq} />
          <Header as="h2">FAQ Management</Header>
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
                      FAQ 정보
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  <Table.Row>
                    <Table.Cell className="tb-header">
                      지원 언어 <span className="required">*</span>
                    </Table.Cell>
                    <Table.Cell>
                      <Polyglot.Languages onChangeProps={this.onChangeContentsProps} />
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="tb-header">
                      기본 언어 <span className="required">*</span>
                    </Table.Cell>
                    <Table.Cell>
                      <Polyglot.Default onChangeProps={this.onChangeContentsProps} />
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="tb-header">구분</Table.Cell>
                    <Table.Cell>
                      <Form.Group>
                        <Form.Field
                          control={Select}
                          placeholder="Select"
                          options={this.addCategoryList()}
                          onChange={(e: any, data: any) => {
                            this.onChangeContentsProps('category', data.value);
                          }}
                        />
                      </Form.Group>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="tb-header">공지 구분</Table.Cell>
                    <Table.Cell>
                      <Form.Group>
                        <Form.Field
                          control={Select}
                          placeholder="Select"
                          options={SelectType.noticeTypeForCreateNotice}
                          defaultValue={SelectType.noticeTypeForCreateNotice[1].value}
                          onChange={(e: any, data: any) => {
                            this.onChangeContentsProps('pinned', data.value);
                          }}
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
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="tb-header">제목</Table.Cell>
                    <Table.Cell>
                      {/*<Form.Field
                        control={Input}
                        placeholder="Please enter the FAQ title."
                        // maxLength={51}
                        onChange={(e: any) => this.onChangeContentsProps('title', e.target.value)}
                      />*/}
                      <Polyglot.Input
                        languageStrings={post.title}
                        name="title"
                        onChangeProps={this.onChangeContentsProps}
                        placeholder="FAQ 제목을 입력해주세요."
                      />
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="tb-header">내용</Table.Cell>
                    <Table.Cell>
                      {/*<Editor
                        post={post}
                        value={(post && post.contents && post.contents.contents) || ''}
                        onChangeContentsProps={this.onChangeContentsProps}
                      />*/}
                      <Polyglot.Editor
                        name="contents.contents[0].contents"
                        languageStrings={post.contents.contents[0]?.contents || new PolyglotModel()}
                        onChangeProps={this.onChangeContentsProps}
                      />
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Polyglot>
          </Form>
          <div className="fl-right btn-group">
            <Button onClick={this.routeToPostList}>목록</Button>
            <Button primary onClick={this.handleSave}>
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

export default withRouter(CreateFaqContainer);
