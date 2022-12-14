import React from 'react';
import { Button, Form, Input, Table, Radio } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import XLSX from 'xlsx';

import depot from '@nara.drama/depot';
import { ReactComponent, reactAutobind } from '@nara.platform/accent';
import { FileBox, PatronType, ValidationType } from '@nara.drama/depot';

import { Modal, RadioGroup, SubActions, AlertModel, alert, Polyglot } from 'shared/components';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';
import { DepotUtil } from 'shared/ui';
import { uuidv4 } from 'shared/helper';

import { CardService } from 'card';
import { findDiscussionFeedBack } from 'discussion/api/discussionApi';
import { CommentService } from 'feedback/comment';
import { CommentXlsxModel } from 'feedback/comment/model/CommentXlsxModel';
import { CommentModel } from 'feedback/comment/model/CommentModel';

import DiscussionService from '../../present/logic/DiscussionService';
import RelatedUrl from '../../model/RelatedUrl';
import Discussion from '../../model/Discussion';

interface Props {
  //
  isUpdatable?: boolean;
  onClickOk: (discussion: Discussion, index: number, pIndex: number) => void;
  index?: number;
  pIndex?: number;
  learningDiscussion?: Discussion;
  cardService: CardService;
}

interface State {
  //
  open: boolean;
  filesMap: Map<string, any>;
}

interface Injected {
  discussionService: DiscussionService;
  commentService: CommentService;
}

@inject('discussionService', 'commentService')
@observer
@reactAutobind
class DiscussionModal extends ReactComponent<Props, State, Injected> {
  //
  descriptionQuillRef: any = null;

  state: State = {
    open: false,
    filesMap: new Map<string, any>(),
  };

  open() {
    //
    this.setState({ open: true });
  }

  close() {
    //
    this.setState({ open: false });
  }

  onMount() {
    //
    const { learningDiscussion, cardService } = this.props;
    const { setDiscussion, clearDiscussion, discussion } = this.injected.discussionService;
    const { commentService } = this.injected;

    if (learningDiscussion) {
      setDiscussion(learningDiscussion);
      if (learningDiscussion.commentFeedbackId) {
        this.findDiscussionFeedback(learningDiscussion.commentFeedbackId);
        commentService!.setCommentOffset('feedbackId', learningDiscussion.commentFeedbackId);
      }
    } else {
      clearDiscussion();
      commentService!.setCommentOffset('feedbackId', '');
    }
    this.getFileIds();
  }

  onClickAddRelatedUrl() {
    //
    const { discussion, changeDiscussionProp } = this.injected.discussionService;
    const newRelatedUrls = [...discussion.relatedUrlList, new RelatedUrl()];
    changeDiscussionProp('relatedUrlList', newRelatedUrls);
  }

  onClickRemoveRelatedUrl(index: number) {
    //
    const { discussion, changeDiscussionProp } = this.injected.discussionService;
    const newRelatedUrls = this.removeInList(index, [...discussion.relatedUrlList]);
    changeDiscussionProp('relatedUrlList', newRelatedUrls);
  }

  removeInList(index: number, oldList: RelatedUrl[]) {
    //
    return oldList.slice(0, index).concat(oldList.slice(index + 1));
  }

  getFileBoxId(depotId: string) {
    //
    const { changeDiscussionProp } = this.injected.discussionService;

    changeDiscussionProp('depotId', depotId);
  }

  async onClickCancel() {
    //
    // this.injected.discussionService.clearDiscussion();
    this.close();
  }

  async onClickOk() {
    //
    const { discussion, clearDiscussion } = this.injected.discussionService;
    const { onClickOk, index, pIndex } = this.props;

    const id = discussion.id === '' ? uuidv4() : discussion.id;

    if (this.validationCheck()) {
      onClickOk &&
        (await onClickOk({ ...discussion, id }, index === undefined ? -1 : index, pIndex === undefined ? -1 : pIndex));
      // await clearDiscussion();
      await this.close();
    }
  }

  async findDiscussionFeedback(feedbackId: string) {
    //
    const { changeDiscussionProp } = this.injected.discussionService;
    findDiscussionFeedBack(feedbackId).then((findPrivateState) => {
      if (findPrivateState) {
        changeDiscussionProp(
          'privateComment',
          findPrivateState.config.privateComment === undefined ? false : findPrivateState?.config.privateComment
        );
      }
    });
  }

  async findCommentsForExcel(): Promise<string> {
    //
    const { commentService } = this.injected;

    commentService!.setCommentOffset('period.startDateMoment', 0);
    const comments = await commentService!.findCommentsForExcel();
    let fileName = '';
    if (comments && comments.length > 0) {
      const commentXlsxList: CommentXlsxModel[] = [];
      comments.map((comment, index) => {
        commentXlsxList.push(CommentModel.asXLSX(comment, index));
      });

      const commentExcel = XLSX.utils.json_to_sheet(commentXlsxList);
      const temp = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(temp, commentExcel, 'Comments');
      fileName = `comments.xlsx`;
      XLSX.writeFile(temp, fileName, { compression: true });
    } else {
      alert(AlertModel.getCustomAlert(false, '??????', '????????? ????????? ????????????', '??????'));
    }
    return fileName;
  }

  validationCheck() {
    //
    const { discussion } = this.injected.discussionService;

    //TODO: discussion validationCheck

    // if (discussion.title === '') {
    //   //
    //   alert(AlertModel.getRequiredInputAlert('?????? ??????'));
    //   return false;
    // }

    return true;
  }

  getFileIds() {
    //
    const { discussion } = this.injected.discussionService;
    this.findFiles('reference', discussion.depotId);
  }

  findFiles(type: string, fileBoxId: string) {
    const { filesMap } = this.state;
    depot.getDepotFiles(fileBoxId).then((files) => {
      filesMap.set(type, files);
      const newMap = new Map(filesMap.set(type, files));
      this.setState({ filesMap: newMap });
    });
  }

  render() {
    //
    const { isUpdatable, learningDiscussion } = this.props;
    const { discussion, changeDiscussionProp } = this.injected.discussionService;

    return (
      <>
        {learningDiscussion ? (
          <Table.Cell style={{ cursor: 'pointer' }} onClick={this.open}>
            {getPolyglotToAnyString(learningDiscussion.title)}
          </Table.Cell>
        ) : (
          <Button onClick={this.open}>Talk ??????</Button>
        )}
        <Modal size="large" open={this.state.open} onMount={this.onMount}>
          <Modal.Header>Talk ??????</Modal.Header>
          <Modal.Content style={{ overflow: 'auto', height: 700 }}>
            <Form>
              <Table celled style={{ marginBottom: 0 }}>
                <colgroup>
                  <col width="20%" />
                  <col width="80%" />
                </colgroup>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>
                      ?????? <span className="required">*</span>
                    </Table.Cell>
                    <Table.Cell>
                      {/*<input*/}
                      {/*  disabled={!isUpdatable && !isUpdatable}*/}
                      {/*  placeholder="?????? ????????? ????????? Question??? ??????????????????."*/}
                      {/*  value={discussion ? getPolyglotToString(discussion.title) : ''}*/}
                      {/*  maxLength={100}*/}
                      {/*  onChange={(e: any) => changeDiscussionProp('title', e.target.value)}*/}
                      {/*/>*/}

                      <Polyglot.Input
                        name="title"
                        onChangeProps={changeDiscussionProp}
                        languageStrings={discussion.title}
                        placeholder="?????? ????????? ????????? ????????? ??????????????????."
                      />
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>?????? ??????</Table.Cell>
                    <Table.Cell className="pop-editor">
                      {/*<HtmlEditor*/}
                      {/*  quillRef={(el) => {*/}
                      {/*    this.descriptionQuillRef = el;*/}
                      {/*  }}*/}
                      {/*  modules={SelectType.modules}*/}
                      {/*  formats={SelectType.formats}*/}
                      {/*  placeholder="Talk ????????? ?????? ?????? ????????? ??????????????????."*/}
                      {/*  onChange={(html) => changeDiscussionProp('content', html === '<p><br></p>' ? '' : html)}*/}
                      {/*  value={discussion ? getPolyglotToString(discussion.content) : ''}*/}
                      {/*  readOnly={!isUpdatable}*/}
                      {/*/>*/}

                      <Polyglot.Editor
                        name="content"
                        onChangeProps={changeDiscussionProp}
                        languageStrings={discussion.content}
                        placeholder="Talk ????????? ?????? ?????? ????????? ??????????????????."
                      />
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>?????? URL</Table.Cell>
                    <Table.Cell>
                      {discussion && discussion.relatedUrlList && discussion.relatedUrlList.length > 0
                        ? discussion.relatedUrlList.map((relatedUrl, index) => {
                            return (
                              <div className="margin-bottom10" key={index}>
                                <Form.Field
                                  control={Input}
                                  disabled={!isUpdatable && !isUpdatable}
                                  fluid
                                  className="margin-bottom5"
                                  placeholder="?????? URL ???????????? ??????????????????"
                                  value={relatedUrl.title}
                                  onChange={(e: any, data: any) =>
                                    changeDiscussionProp(`relatedUrlList[${index}].title`, data.value)
                                  }
                                />

                                <Form.Field
                                  control={Input}
                                  disabled={!isUpdatable && !isUpdatable}
                                  maxLength={100}
                                  fluid
                                  className="action-height37"
                                  action={
                                    discussion.relatedUrlList.length === index + 1 ? (
                                      <>
                                        <Button className="icon" onClick={() => this.onClickAddRelatedUrl()}>
                                          <i className="plus link icon" />
                                        </Button>
                                        <Button
                                          className="icon"
                                          onClick={() => this.onClickRemoveRelatedUrl(index)}
                                          disabled={index === 0}
                                        >
                                          <i className="minus link icon" />
                                        </Button>
                                      </>
                                    ) : (
                                      {
                                        icon: { name: 'minus', link: true },
                                        onClick: () => this.onClickRemoveRelatedUrl(index),
                                      }
                                    )
                                  }
                                  placeholder="https://"
                                  value={relatedUrl.url}
                                  onChange={(e: any, data: any) =>
                                    changeDiscussionProp(`relatedUrlList[${index}].url`, data.value)
                                  }
                                />
                              </div>
                            );
                          })
                        : '-'}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>?????? ??????</Table.Cell>
                    <Table.Cell>
                      <div className="lg-attach">
                        <div className="attach-inner">
                          <FileBox
                            id={(discussion && discussion.depotId) || ''}
                            vaultKey={{ keyString: 'sku-depot', patronType: PatronType.Pavilion }}
                            patronKey={{ keyString: 'sku-denizen', patronType: PatronType.Denizen }}
                            validations={[
                              { type: ValidationType.Duplication, validator: DepotUtil.duplicationValidator },
                            ]}
                            onChange={this.getFileBoxId}
                            options={{ readonly: !isUpdatable }}
                          />
                          {isUpdatable && (
                            <>
                              <ol className="info-text-gray" style={{ textAlign: 'left' }}>
                                - DOC, PDF, EXL, JPEG, PNG ????????? ???????????? ??? ????????????.
                              </ol>
                              <ol className="info-text-gray" style={{ textAlign: 'left' }}>
                                - ?????? 10MB ????????? ????????? ???????????? ??? ????????????.
                              </ol>
                            </>
                          )}
                        </div>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>?????? ?????? ??????</Table.Cell>
                    <Table.Cell>
                      <Form.Group inline>
                        <RadioGroup
                          as={Form.Field}
                          control={Radio}
                          values={['false', 'true']}
                          labels={['??????', '?????????']}
                          value={discussion.privateComment ? 'true' : 'false'}
                          onChange={() =>
                            changeDiscussionProp('privateComment', discussion.privateComment ? false : true)
                          }
                        />
                      </Form.Group>
                      {discussion.privateComment && (
                        <ol className="info-text-gray" style={{ textAlign: 'left' }}>
                          - ????????? ????????? ???????????? ???????????? ???????????? ?????????, ????????? ????????? ???????????? ????????? ??? ????????????.
                        </ol>
                      )}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>??????</Table.Cell>
                    <Table.Cell>
                      <SubActions.ExcelButton
                        download
                        disabled={!learningDiscussion?.commentFeedbackId}
                        onClick={this.findCommentsForExcel}
                      />
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={this.onClickCancel} type="button">
              Cancel
            </Button>

            {isUpdatable && (
              <Button primary onClick={this.onClickOk} type="button">
                OK
              </Button>
            )}
          </Modal.Actions>
        </Modal>
      </>
    );
  }
}

export default DiscussionModal;
