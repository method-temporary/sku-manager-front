import React from 'react';
import { observer } from 'mobx-react';
import { Button, Form, Input, Table } from 'semantic-ui-react';
import dayjs from 'dayjs';
import XLSX from 'xlsx';

import { FileBox, PatronType, ValidationType } from '@nara.drama/depot';

import { CardDiscussion } from '_data/lecture/cards/model/CardDiscussion';

import { getPolyglotToAnyString, isDefaultPolyglotBlank, LangSupport } from 'shared/components/Polyglot';
import { alert, AlertModel, Modal, Polyglot, RadioGroup, SubActions } from 'shared/components';
import { DepotUtil } from 'shared/ui';
import { booleanToYesNo, yesNoToBoolean } from 'shared/helper';

import { CommentXlsxModel, CommentXlsxModelFunc } from '../../../../card/create/basic/model/CommentXlsxModel';
import DiscussionModalStore from './DiscussionModal.store';

interface Props {
  //
  unVisible?: boolean; // 모달과 모달 띄우는 버튼이 보이지 않도록 할 때
  readonly?: boolean; // 모달은 보여주지만 Disabled 할 때 사용
  langSupports: LangSupport[];
  trigger?: React.ReactElement;
  triggerAs?: any;
  discussion?: CardDiscussion;
  onCancel?: () => void;
  onOk?: (discussion: CardDiscussion) => void;
}

const DiscussionModal = observer(
  ({ unVisible, readonly, langSupports, trigger, triggerAs, discussion, onCancel, onOk }: Props) => {
    //
    const {
      title,
      content,
      relatedUrlList,
      depotId,
      privateComment,
      commentFeedbackId,
      setId,
      setTitle,
      setContent,
      setDepotId,
      setRelatedUrlList,
      addRelatedUrlList,
      setPrivateComment,
      setCommentFeedbackId,
      getDiscussion,
      reset,
      findCommentsByQuery,
    } = DiscussionModalStore.instance;

    const onMount = () => {
      //
      reset();

      if (discussion) {
        //
        setId(discussion.id);
        setTitle(discussion.title);
        setContent(discussion.content);
        setDepotId(discussion.depotId);
        setRelatedUrlList(discussion.relatedUrlList);
        setPrivateComment(discussion.privateComment);
        setCommentFeedbackId(discussion.commentFeedbackId);
      }
    };

    const onClickCommentExcelDown = async () => {
      const { results: comments } = await findCommentsByQuery();
      const fileName = `Discussion_Comments_${dayjs().format('YYYY-MM-DD HH:mm:ss')}.xlsx`;

      if (comments && comments.length > 0) {
        const commentXlsxList: CommentXlsxModel[] = [];
        comments.map((comment, index) => {
          commentXlsxList.push(CommentXlsxModelFunc.fromComment(index, comment));
        });

        const commentExcel = XLSX.utils.json_to_sheet(commentXlsxList);
        const temp = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(temp, commentExcel, 'Comments');
        XLSX.writeFile(temp, fileName, { compression: true });
      } else {
        alert(AlertModel.getCustomAlert(false, '안내', '등록된 댓글이 없습니다', '확인'));
      }
      return fileName;
    };

    const onChangeRelatedUrlListTitle = (value: string, seq: number) => {
      //
      setRelatedUrlList(
        relatedUrlList.map((relatedUrl, index) => {
          if (index === seq) {
            //
            return {
              ...relatedUrl,
              title: value,
            };
          } else {
            //
            return relatedUrl;
          }
        })
      );
    };

    const onChangeRelatedUrlListUrl = (value: string, seq: number) => {
      //
      setRelatedUrlList(
        relatedUrlList.map((relatedUrl, index) => {
          if (index === seq) {
            //
            return {
              ...relatedUrl,
              url: value,
            };
          } else {
            //
            return relatedUrl;
          }
        })
      );
    };

    const onRemoveRelatedUrlListUrl = (seq: number) => {
      //
      setRelatedUrlList(relatedUrlList.filter((_, index) => index !== seq).map((relatedUrl) => relatedUrl));
    };

    const onClickCancel = (_: React.MouseEvent<HTMLButtonElement>, close: () => void) => {
      //
      onCancel && onCancel();
      reset();
      close();
    };

    const onClickOK = (_: React.MouseEvent<HTMLButtonElement>, close: () => void) => {
      //
      if (isDefaultPolyglotBlank(langSupports, title)) {
        //
        alert(AlertModel.getRequiredInputAlert('질문'));
        return;
      }

      onOk && onOk(getDiscussion());
      onClickCancel(_, close);
    };

    return unVisible ? null : (
      <>
        <Polyglot languages={langSupports}>
          <Modal
            size="large"
            trigger={
              trigger ? (
                trigger
              ) : (
                <Button type="button" disabled={readonly}>
                  Talk 추가
                </Button>
              )
            }
            triggerAs={triggerAs}
            onMount={onMount}
          >
            <Modal.Header>Talk 추가</Modal.Header>
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
                        질문 <span className="required">*</span>
                      </Table.Cell>
                      <Table.Cell>
                        {!readonly ? (
                          <Polyglot.Input
                            name="title"
                            onChangeProps={(_, value) => setTitle(value)}
                            languageStrings={title}
                            placeholder="화면 상단에 노출될 질문을 입력해주세요."
                          />
                        ) : (
                          <>{getPolyglotToAnyString(title)}</>
                        )}
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>상세 설명</Table.Cell>
                      <Table.Cell className="pop-editor">
                        <Polyglot.Editor
                          readOnly={readonly}
                          name="content"
                          onChangeProps={(_, value) => setContent(value)}
                          languageStrings={content}
                          placeholder="Talk 하고자 하는 상세 내용을 입력해주세요."
                        />
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>관련 URL</Table.Cell>
                      <Table.Cell>
                        {relatedUrlList
                          ? relatedUrlList.map((relatedUrl, idx) => {
                              return (
                                <div className="margin-bottom10" key={idx}>
                                  <Form.Field
                                    control={Input}
                                    disabled={readonly}
                                    fluid
                                    className="margin-bottom5"
                                    placeholder="관련 URL 타이틀을 입력해주세요"
                                    value={relatedUrl.title}
                                    onChange={(e: any, data: any) => onChangeRelatedUrlListTitle(data.value, idx)}
                                  />

                                  <Form.Field
                                    control={Input}
                                    disabled={readonly}
                                    maxLength={100}
                                    fluid
                                    className="action-height37"
                                    action={
                                      relatedUrlList.length === idx + 1 ? (
                                        <>
                                          <Button className="icon" onClick={addRelatedUrlList}>
                                            <i className="plus link icon" />
                                          </Button>
                                          <Button
                                            className="icon"
                                            onClick={() => onRemoveRelatedUrlListUrl(idx)}
                                            disabled={idx === 0}
                                          >
                                            <i className="minus link icon" />
                                          </Button>
                                        </>
                                      ) : (
                                        {
                                          icon: { name: 'minus', link: true },
                                          onClick: () => onRemoveRelatedUrlListUrl(idx),
                                        }
                                      )
                                    }
                                    placeholder="https://"
                                    value={relatedUrl.url}
                                    onChange={(e: any, data: any) => onChangeRelatedUrlListUrl(data.value, idx)}
                                  />
                                  {idx === 0 && !readonly && (
                                    <span>
                                      <span className="required">*</span>https://를 제외한 URL을 입력해 주세요.
                                    </span>
                                  )}
                                </div>
                              );
                            })
                          : '-'}
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>관련 자료</Table.Cell>
                      <Table.Cell>
                        <div className="lg-attach">
                          <div className="attach-inner">
                            <FileBox
                              id={depotId || ''}
                              vaultKey={{ keyString: 'sku-depot', patronType: PatronType.Pavilion }}
                              patronKey={{ keyString: 'sku-denizen', patronType: PatronType.Denizen }}
                              validations={[
                                { type: ValidationType.Duplication, validator: DepotUtil.duplicationValidator },
                              ]}
                              onChange={setDepotId}
                              options={{ readonly }}
                            />
                            {!readonly && (
                              <>
                                <ol className="info-text-gray" style={{ textAlign: 'left' }}>
                                  - DOC, PDF, EXL, JPEG, PNG 파일을 등록하실 수 있습니다.
                                </ol>
                                <ol className="info-text-gray" style={{ textAlign: 'left' }}>
                                  - 최대 10MB 용량의 파일을 등록하실 수 있습니다.
                                </ol>
                              </>
                            )}
                          </div>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>의견 공개 설정</Table.Cell>
                      <Table.Cell>
                        {readonly ? (
                          <span>{(privateComment && '비공개') || '공개'}</span>
                        ) : (
                          <Form.Group>
                            <RadioGroup
                              values={['No', 'Yes']}
                              labels={['공개', '비공개']}
                              value={booleanToYesNo(privateComment)}
                              onChange={(_, data: any) => setPrivateComment(yesNoToBoolean(data.value))}
                            />
                          </Form.Group>
                        )}

                        {privateComment && (
                          <ol className="info-text-gray" style={{ textAlign: 'left' }}>
                            - 의견이 비공개 처리되어 학습자간 공유되지 않으며, 작성한 본인과 관리자만 확인할 수
                            있습니다.
                          </ol>
                        )}
                      </Table.Cell>
                    </Table.Row>
                    {commentFeedbackId && (
                      <Table.Row>
                        <Table.Cell>댓글</Table.Cell>
                        <Table.Cell>
                          <SubActions.ExcelButton download onClick={onClickCommentExcelDown} />
                        </Table.Cell>
                      </Table.Row>
                    )}
                  </Table.Body>
                </Table>
              </Form>
            </Modal.Content>
            <Modal.Actions>
              <Modal.CloseButton className="w190 d" onClickWithClose={onClickCancel} type="button">
                Cancel
              </Modal.CloseButton>

              {!readonly && (
                <Modal.CloseButton className="w190 p" onClickWithClose={onClickOK} type="button">
                  OK
                </Modal.CloseButton>
              )}
            </Modal.Actions>
          </Modal>
        </Polyglot>
      </>
    );
  }
);

export default DiscussionModal;
