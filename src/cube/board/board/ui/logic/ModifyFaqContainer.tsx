import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Button, Container, Form, Icon, Select, Table } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import DatePicker from 'react-datepicker';
import moment, { Moment } from 'moment';

import { reactAutobind } from '@nara.platform/accent';

import { PolyglotModel, SelectType } from 'shared/model';
import { Polyglot } from 'shared/components';
import { getDefaultLanguage, getPolyglotToAnyString } from 'shared/components/Polyglot';
import { ConfirmWin } from 'shared/ui';

import PostService from '../../../post/present/logic/PostService';
import { PostModel } from '../../../post/model/PostModel';
import CategoryService from '../../../category/present/logic/CategoryService';
import { serviceManagementUrl } from '../../../../../Routes';

interface Props extends RouteComponentProps<{ cineroomId: string; postId: string }> {
  postService?: PostService;
  categoryService?: CategoryService;
}

interface States {
  confirmWinOpen: boolean;
}

@inject('postService', 'categoryService')
@observer
@reactAutobind
class ModifyFaqContainer extends React.Component<Props, States> {
  //
  constructor(props: Props) {
    //
    super(props);
    this.state = {
      confirmWinOpen: false,
    };
  }

  componentDidMount() {
    //
    this.init();
  }

  init() {
    //
    const { postService, categoryService } = this.props;
    const { postId } = this.props.match.params;
    if (postService && categoryService) {
      postService.findPostByPostId(postId);
      categoryService.findCategoriesByBoardId('FAQ');
    }
  }

  onChangerContentsProps(name: string, value: string) {
    //
    const { postService } = this.props;
    if (name === 'title' && value.length > 51) {
      alert('제목은 50자를 넘을 수 없습니다.');
    }
    if (postService) postService.changePostProps(name, value);
  }

  routeToPostList() {
    //
    this.props.history.push(`/cineroom/${this.props.match.params.cineroomId}/${serviceManagementUrl}/boards/faq-list`);
  }

  handleCloseConfirmWin() {
    //
    this.setState({
      confirmWinOpen: false,
    });
  }

  handleOKConfirmWin() {
    //
    const { postService } = this.props;
    const { postId } = this.props.match.params;
    const { post } = this.props.postService || ({} as PostService);
    Promise.resolve()
      .then(() => postService && postService.modifyPost(postId, post))
      .then(() => this.routeToPostList());
  }

  handleSave() {
    //
    const { post } = this.props.postService || ({} as PostService);
    if (PostModel.isBlank(post) === 'success') {
      this.setState({ confirmWinOpen: true });
    }
  }

  addCategoryList() {
    //
    const { categories } = this.props.categoryService || ({} as CategoryService);
    const list: any = [];
    categories.forEach((category, index) => {
      list.push({
        key: index,
        text: getPolyglotToAnyString(category.name),
        value: { id: category.categoryId, name: category.name },
      });
    });

    return list;
  }

  onChangePostPeriodProps(name: string, value: Moment) {
    //
    const { postService } = this.props;
    if (name === 'period.startDateMoment') postService!.changePostPeriodProps(name, value);
    if (name === 'period.endDateMoment') postService!.changePostPeriodProps(name, value);
  }

  render() {
    const { post } = this.props.postService || ({} as PostService);
    const { confirmWinOpen } = this.state;

    return (
      <Container>
        <Form>
          <Polyglot languages={post.langSupports}>
            <Table celled>
              <colgroup>
                <col width="20%" />
                <col width="80%" />
              </colgroup>

              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell colSpan={2}>FAQ 정보</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
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
                  <Table.Cell>구분</Table.Cell>
                  <Table.Cell>
                    <Form.Group>
                      <Form.Field
                        control={Select}
                        placeholder="Select"
                        options={this.addCategoryList()}
                        value={(post && post.category) || ''}
                        onChange={(e: any, data: any) => {
                          this.onChangerContentsProps('category', data.value);
                        }}
                      />
                    </Form.Group>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>공지 구분</Table.Cell>
                  <Table.Cell>
                    <Form.Group>
                      <Form.Field
                        control={Select}
                        placeholder="Select"
                        options={SelectType.noticeTypeForCreateNotice}
                        value={post.pinned}
                        onChange={(e: any, data: any) => {
                          this.onChangerContentsProps('pinned', data.value);
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
                              minDate={moment().toDate()}
                              dateFormat="yyyy.MM.dd"
                            />
                            <Icon name="calendar alternate outline" />
                          </div>
                          <div className="dash">-</div>
                          <div className="ui input right icon">
                            <DatePicker
                              placeholderText="마지막날짜를 선택해주세요."
                              selected={(post && post.period && post.period.endDateObj) || ''}
                              // value={ post && post.period && post.period.endDate && new Date(Number(post.period.endDate)).toLocaleDateString() }
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
                  <Table.Cell>제목</Table.Cell>
                  <Table.Cell>
                    {/*<Form.Field
                      control={Input}
                      placeholder="Please enter the FAQ title."
                      value={(post && post.title) || 'Please enter the FAQ title.'}
                      onChange={(e: any) => this.onChangerContentsProps('title', e.target.value)}
                    />*/}
                    <Polyglot.Input
                      languageStrings={post.title}
                      name="title"
                      onChangeProps={this.onChangerContentsProps}
                      placeholder="FAQ 제목을 입력해주세요."
                    />
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>내용</Table.Cell>
                  <Table.Cell>
                    {/*<Editor
                      post={post}
                      value={(post && post.contents && post.contents.contents) || ''}
                      onChangeContentsProps={this.onChangerContentsProps}
                    />*/}
                    <Polyglot.Editor
                      name="contents.contents"
                      languageStrings={post.contents.contents[0]?.contents || new PolyglotModel()}
                      onChangeProps={this.onChangerContentsProps}
                    />
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>작성자 및 조회수</Table.Cell>
                  <Table.Cell>
                    {post &&
                      post.writer &&
                      post.writer.name &&
                      getPolyglotToAnyString(post.writer.name, getDefaultLanguage(post.langSupports))}{' '}
                    | {post.time && new Date(post.time).toLocaleDateString()} | {post.readCount} View
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Polyglot>
          <div className="btn-group">
            <Button type="button">삭제</Button>
            <div className="fl-right">
              <Button basic onClick={this.routeToPostList} type="button">
                목록
              </Button>
              <Button primary onClick={this.handleSave} type="button">
                저장
              </Button>
            </div>
          </div>
        </Form>
        <ConfirmWin
          message="수정하시겠습니까?"
          open={confirmWinOpen}
          handleClose={this.handleCloseConfirmWin}
          handleOk={this.handleOKConfirmWin}
          title="저장 안내"
          buttonYesName="저장"
          buttonNoName="취소"
        />
      </Container>
    );
  }
}

export default withRouter(ModifyFaqContainer);
