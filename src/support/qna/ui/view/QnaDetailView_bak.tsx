import * as React from 'react';
import { observer } from 'mobx-react';
import { Breadcrumb, Button, Form, Header, Icon, Input, Table } from 'semantic-ui-react';
import ReactQuill from 'react-quill';
import moment from 'moment';

import { reactAutobind } from '@nara.platform/accent';
import depot, { DepotFileViewModel, FileBox, PatronType, ValidationType } from '@nara.drama/depot';

import { SelectType, PolyglotModel } from 'shared/model';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';
import { AlertWin, ConfirmWin, DepotUtil, HtmlEditor } from 'shared/ui';

import { PostModel } from '../../../../cube/board/post/model/PostModel';
import { AnswerModel } from '../../../../cube/board/post/model/AnswerModel';
import { QnAFunnelModel } from '../../../../cube/board/board/model/vo/QnAFunnelModel';
import ConfirmWinForDelete from '../../../../cube/board/board/ui/logic/ConfirmWinForDelete';
import EditorForAnswer from '../../../../cube/board/board/ui/logic/EditorForAnswer';

interface Props {
  post: PostModel;
  answer: AnswerModel;
  onChangerContentsProps: (name: string, value: string | PolyglotModel) => void;
  editorOpen: boolean;
  handleDelete: () => void;
  routeToPostList: () => void;
  handleSave: () => void;
  handleCloseAlertWin: () => void;
  handleCloseConfirmWin: () => void;
  handleOKConfirmWin: () => void;
  handleOKConfirmWinForDelete: () => void;
  routeToModifyQNA: () => void;
  confirmWinForDeleteOpen: boolean;
  isBlankTarget: string;
  alertWinOpen: boolean;
  confirmWinOpen: boolean;
  handleOKForModificationConfirmWin: () => void;
  getFileBoxIdForReference: (fileBoxId: string) => void;
  alertIcon: string;
  type: string;
  title: string;
  handleOk: () => void;
  filesMap: Map<string, any>;
  filesMapForAnswer: Map<string, any>;
  changeDateToString: (date: Date) => string;
  name: string;
  email: string;
  qnaFunnel: QnAFunnelModel;
}

@observer
@reactAutobind
class QnaDetailView extends React.Component<Props> {
  //
  render() {
    const {
      post,
      answer,
      onChangerContentsProps,
      handleDelete,
      routeToPostList,
      handleSave,
      handleCloseAlertWin,
      handleCloseConfirmWin,
      handleOKConfirmWin,
      handleOKConfirmWinForDelete,
      handleOKForModificationConfirmWin,
      confirmWinForDeleteOpen,
      isBlankTarget,
      editorOpen,
      alertWinOpen,
      routeToModifyQNA,
      confirmWinOpen,
      getFileBoxIdForReference,
      handleOk,
      alertIcon,
      type,
      title,
      filesMap,
      filesMapForAnswer,
      changeDateToString,
      qnaFunnel,
    } = this.props;
    return (
      <>
        <div>
          <Breadcrumb icon="right angle" sections={SelectType.leftHandSideExpressionBar} />
          <Header as="h2">Q&A 관리</Header>
        </div>
        <Table celled>
          <colgroup>
            <col width="20%" />
            <col width="80%" />
          </colgroup>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan={2} className="title-header">
                Q&A 정보
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell className="tb-header">카테고리</Table.Cell>
              <Table.Cell>{getPolyglotToAnyString(post.category.name)}</Table.Cell>
            </Table.Row>
            {qnaFunnel.name !== '' && (
              <Table.Row>
                <Table.Cell className="tb-header">유입경로</Table.Cell>
                <Table.Cell>
                  <Table celled>
                    <colgroup>
                      <col width="35%" />
                      <col width="15%" />
                      <col width="20%" />
                      <col width="15%" />
                      <col width="15%" />
                    </colgroup>

                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>{qnaFunnel.type === 'Card' ? 'Card명' : 'Cube명'}</Table.HeaderCell>
                        <Table.HeaderCell>학습유형</Table.HeaderCell>
                        <Table.HeaderCell>Channel</Table.HeaderCell>
                        <Table.HeaderCell>등록일자</Table.HeaderCell>
                        <Table.HeaderCell>생성자</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>

                    <Table.Body>
                      <Table.Row>
                        <Table.Cell>{qnaFunnel && qnaFunnel.name}</Table.Cell>
                        <Table.Cell>{qnaFunnel && qnaFunnel.type}</Table.Cell>
                        <Table.Cell>{qnaFunnel && qnaFunnel.channel}</Table.Cell>
                        <Table.Cell>{qnaFunnel && moment(qnaFunnel.time).format('YYYY. M. D.')}</Table.Cell>
                        <Table.Cell>{qnaFunnel && qnaFunnel.creatorName}</Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </Table.Cell>
              </Table.Row>
            )}
            <Table.Row>
              <Table.Cell className="tb-header">제목</Table.Cell>
              <Table.Cell>{getPolyglotToAnyString(post.title)}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className="tb-header">작성자 정보</Table.Cell>
              <Table.Cell>
                {post.writer && getPolyglotToAnyString(post.writer.name)}&nbsp;&nbsp;|&nbsp;&nbsp;
                {post.writer && getPolyglotToAnyString(post.writer.companyName)}&nbsp;&nbsp;|&nbsp;&nbsp;
                {post.writer && post.writer.email}&nbsp;&nbsp;|&nbsp;&nbsp;
                {changeDateToString(new Date(post.registeredTime))}&nbsp;
                {post.registeredTime && new Date(post.registeredTime).toLocaleTimeString('en-GB').substring(0, 5)}
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className="tb-header">내용</Table.Cell>
              <Table.Cell>
                <ReactQuill
                  theme="bubble"
                  value={getPolyglotToAnyString(post.contents.contents[0]?.contents) || ''}
                  readOnly
                />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className="tb-header">첨부파일</Table.Cell>
              <Table.Cell>
                <div className="file">
                  {(filesMap &&
                    filesMap.get('reference') &&
                    filesMap.get('reference').map((foundedFile: DepotFileViewModel, index: number) => (
                      <a href="#" className="link" key={index}>
                        <span className="ellipsis" onClick={() => depot.downloadDepotFile(foundedFile.id)}>
                          {foundedFile.name}
                        </span>
                      </a>
                    ))) ||
                    '-'}
                </div>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
        <Form>
          <Table celled>
            <colgroup>
              <col width="20%" />
              <col width="80%" />
            </colgroup>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell colSpan={2} className="title-header">
                  답변 정보
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            {(post && !post.answered && (
              <Table.Body>
                <Table.Row>
                  <Table.Cell className="tb-header">제목</Table.Cell>
                  <Table.Cell>
                    <Form.Field
                      control={Input}
                      placeholder="제목을 입력해주세요."
                      onChange={(e: any) => onChangerContentsProps('title', e.target.value)}
                    />
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell className="tb-header">내용</Table.Cell>
                  <Table.Cell>
                    <EditorForAnswer
                      answer={answer}
                      value={(answer.contents && answer.contents.contents) || ''}
                      onChangeContentsProps={onChangerContentsProps}
                    />
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell className="tb-header">첨부파일</Table.Cell>
                  <Table.Cell>
                    <Form.Field>
                      <Form>
                        <div className="lg-attach">
                          <div className="attach-inner">
                            <FileBox
                              id={(answer && answer.contents && answer.contents.depotId) || ''}
                              vaultKey={{
                                keyString: 'sku-depot',
                                patronType: PatronType.Pavilion,
                              }}
                              patronKey={{
                                keyString: 'sku-denizen',
                                patronType: PatronType.Denizen,
                              }}
                              validations={[
                                {
                                  type: ValidationType.Duplication,
                                  validator: DepotUtil.duplicationValidator,
                                },
                              ]}
                              onChange={getFileBoxIdForReference}
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
                      </Form>
                    </Form.Field>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            )) ||
              (post && post.answered && !editorOpen && (
                <Table.Body>
                  <Table.Row>
                    <Table.Cell className="tb-header">제목</Table.Cell>
                    <Table.Cell>{answer && answer.title}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="tb-header">내용</Table.Cell>
                    <Table.Cell>
                      <HtmlEditor theme="bubble" value={getPolyglotToAnyString(answer.contents.contents)} readOnly />
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="tb-header">첨부파일</Table.Cell>
                    <Table.Cell>
                      <div className="file">
                        {(filesMapForAnswer &&
                          filesMapForAnswer.get('referenceForAnswer') &&
                          filesMapForAnswer
                            .get('referenceForAnswer')
                            .map((foundedFile: DepotFileViewModel, index: number) => (
                              <a href="#" className="link" key={index}>
                                <span className="ellipsis" onClick={() => depot.downloadDepotFile(foundedFile.id)}>
                                  {foundedFile.name}
                                </span>
                              </a>
                            ))) ||
                          '-'}
                      </div>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="tb-header">최초작성자</Table.Cell>
                    <Table.Cell>
                      {answer.writer && getPolyglotToAnyString(answer.writer.name)} &nbsp;&nbsp;|&nbsp;&nbsp;{' '}
                      {answer.writer && answer.writer.email} | &nbsp;&nbsp;
                      {answer.writtenTime && changeDateToString(new Date(answer.writtenTime))}
                      &nbsp;
                      {post &&
                        post.answeredAt &&
                        new Date(post.answeredAt).toLocaleTimeString('en-GB').substring(0, 5)}{' '}
                      | 답변완료
                    </Table.Cell>
                  </Table.Row>
                  {(answer && answer.updateTime > 0 && (
                    <Table.Row>
                      <Table.Cell className="tb-header">최종작성자</Table.Cell>
                      <Table.Cell>
                        {answer.updater && answer.updater.name} &nbsp;&nbsp;|&nbsp;&nbsp;{' '}
                        {answer.updater && answer.updater.email} | &nbsp;&nbsp;
                        {answer && answer.updateTime && changeDateToString(new Date(answer.updateTime))}
                        &nbsp;
                        {answer.updateTime && new Date(answer.updateTime).toLocaleTimeString('en-GB').substring(0, 5)} |
                        답변완료
                      </Table.Cell>
                    </Table.Row>
                  )) ||
                    ''}
                </Table.Body>
              )) ||
              (post && post.answered && editorOpen && (
                <Table.Body>
                  <Table.Row>
                    <Table.Cell className="tb-header">제목</Table.Cell>
                    <Table.Cell>
                      <Form.Field
                        control={Input}
                        placeholder="제목을 입력해주세요."
                        value={(answer && answer.title) || ''}
                        onChange={(e: any) => onChangerContentsProps('title', e.target.value)}
                      />
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="tb-header">내용</Table.Cell>
                    <Table.Cell>
                      <EditorForAnswer
                        answer={answer}
                        value={(answer.contents && answer.contents.contents) || ''}
                        onChangeContentsProps={onChangerContentsProps}
                      />
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="tb-header">첨부파일</Table.Cell>
                    <Table.Cell>
                      <Form>
                        <div className="lg-attach">
                          <div className="attach-inner">
                            <FileBox
                              id={(answer && answer.contents && answer.contents.depotId) || ''}
                              vaultKey={{
                                keyString: 'sku-depot',
                                patronType: PatronType.Pavilion,
                              }}
                              patronKey={{
                                keyString: 'sku-denizen',
                                patronType: PatronType.Denizen,
                              }}
                              validations={[
                                {
                                  type: ValidationType.Duplication,
                                  validator: DepotUtil.duplicationValidator,
                                },
                              ]}
                              onChange={getFileBoxIdForReference}
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
                      </Form>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </Form>
        {(post && !post.answered && !editorOpen && (
          <div>
            <div className="btn-group">
              <Button onClick={handleDelete}>삭제</Button>
              <div className="fl-right">
                <Button basic onClick={routeToPostList}>
                  목록
                </Button>
                <Button primary onClick={handleSave}>
                  답변보내기
                </Button>
              </div>
            </div>
            <AlertWin
              message={isBlankTarget}
              handleClose={handleCloseAlertWin}
              handleOk={handleOk}
              open={alertWinOpen}
              alertIcon={alertIcon}
              type={type}
              title={title}
            />
            <ConfirmWin
              message="저장하시겠습니까?"
              open={confirmWinOpen}
              handleClose={handleCloseConfirmWin}
              handleOk={handleOKConfirmWin}
              title="저장 안내"
              buttonYesName="저장"
              buttonNoName="취소"
            />
            <ConfirmWinForDelete
              message="삭제하시겠습니까?"
              open={confirmWinForDeleteOpen}
              handleClose={handleCloseConfirmWin}
              handleOk={handleOKConfirmWinForDelete}
              title="삭제 안내"
              buttonYesName="삭제"
              buttonNoName="취소"
            />
          </div>
        )) ||
          (post && post.answered && !editorOpen && (
            <div>
              <div className="btn-group">
                <Button onClick={handleDelete}>삭제</Button>
                <div className="fl-right">
                  <Button onClick={routeToPostList}>목록</Button>
                  <Button primary onClick={routeToModifyQNA}>
                    수정
                  </Button>
                </div>
              </div>
              <ConfirmWinForDelete
                message="삭제하시겠습니까?"
                open={confirmWinForDeleteOpen}
                handleClose={handleCloseConfirmWin}
                handleOk={handleOKConfirmWinForDelete}
                title="삭제 안내"
                buttonYesName="삭제"
                buttonNoName="취소"
              />
            </div>
          )) ||
          (post && post.answered && editorOpen && (
            <div>
              <div className="btn-group">
                <div className="fl-right">
                  <Button onClick={routeToPostList}>목록</Button>
                  <Button primary onClick={handleSave}>
                    저장
                  </Button>
                </div>
              </div>
              <AlertWin
                message={isBlankTarget}
                handleClose={handleCloseAlertWin}
                handleOk={handleOk}
                open={alertWinOpen}
                alertIcon={alertIcon}
                type={type}
                title={title}
              />
              <ConfirmWin
                message="수정하시겠습니까?"
                open={confirmWinOpen}
                handleClose={handleCloseConfirmWin}
                handleOk={handleOKForModificationConfirmWin}
                title="저장 안내"
                buttonYesName="저장"
                buttonNoName="취소"
              />
            </div>
          ))}
      </>
    );
  }
}

export default QnaDetailView;
