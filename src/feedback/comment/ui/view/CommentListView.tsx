import * as React from 'react';
import { observer } from 'mobx-react';
import { OffsetElementList, reactAutobind, ReactComponent } from '@nara.platform/accent';
import { CommentModel } from '../../model/CommentModel';
import { Icon, Table } from 'semantic-ui-react';
import { SubCommentModel } from '../../model/SubCommentModel';

interface Props {
  removeComment: (commentId: string) => void;
  toggleCommentExpanded: (commentId: string, expanded: boolean) => void;
  removeSubComment: (commentId: string, subCommentId: string | number) => void;
  onAddSubComments: (commentId: string) => void;

  comments: CommentModel[];
  subCommentsMap: Map<string, OffsetElementList<SubCommentModel>>;
  startNo: number;
}

@observer
@reactAutobind
class CommentListView extends ReactComponent<Props, {}> {
  //

  render() {
    //
    const { removeComment, toggleCommentExpanded, removeSubComment, onAddSubComments } = this.props;
    const { comments, subCommentsMap, startNo } = this.props;

    return (
      <Table celled className="table-fixed">
        <colgroup>
          <col width="5%" />
          <col width="10%" />
          <col width="10%" />
          <col width="8%" />
          <col width="15%" />
          <col width="50%" />
          <col width="10%" />
          <col width="8%" />
          <col width="15%" />
          <col width="10%" />
        </colgroup>

        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
            <Table.HeaderCell>소속사</Table.HeaderCell>
            <Table.HeaderCell>소속조직(팀)</Table.HeaderCell>
            <Table.HeaderCell>작성자</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>댓글내용</Table.HeaderCell>
            <Table.HeaderCell>등록일</Table.HeaderCell>
            <Table.HeaderCell>댓글 상태</Table.HeaderCell>
            <Table.HeaderCell>댓글 관리</Table.HeaderCell>
            <Table.HeaderCell>대댓글</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {comments && comments.length > 0 ? (
            comments.map((comment, index) => {
              const offsetList = subCommentsMap.get(comment.id);
              const subComments: SubCommentModel[] = (offsetList && offsetList.results) || [];
              const subTotalCount = (offsetList && offsetList.totalCount) || 0;

              return (
                <React.Fragment key={index}>
                  <Table.Row>
                    <Table.Cell textAlign="center">{startNo - index}</Table.Cell>
                    <Table.Cell>{comment.companyName}</Table.Cell>
                    <Table.Cell>{comment.departmentName}</Table.Cell>
                    <Table.Cell>{comment.displayName}</Table.Cell>
                    <Table.Cell>{comment.email}</Table.Cell>
                    <Table.Cell>{comment.message}</Table.Cell>
                    <Table.Cell>{comment.timeString}</Table.Cell>
                    <Table.Cell>{comment.deleted ? '삭제' : '정상'}</Table.Cell>
                    <Table.Cell>
                      {comment.deleted ? (
                        <>
                          {comment.deletedTimeString} | {comment.deleterName}
                        </>
                      ) : (
                        <a style={{ cursor: 'pointer' }} onClick={() => removeComment(comment.id)}>
                          삭제
                        </a>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      <a
                        style={{ cursor: 'pointer' }}
                        onClick={() => toggleCommentExpanded(comment.id, !comment.expanded)}
                      >
                        {comment.expanded ? '접기' : '보기'}
                      </a>
                    </Table.Cell>
                  </Table.Row>
                  {(comment.expanded && (
                    <Table.Row>
                      <Table.Cell colSpan="6" className="reply-area">
                        <div
                          style={{
                            fontWeight: 'bold',
                            color: '#6684b6',
                            fontSize: '14px',
                          }}
                        >
                          대댓글 목록
                        </div>
                        <Table>
                          <colgroup>
                            <col width="10%" />
                            <col width="65%" />
                            <col width="15%" />
                            <col width="10%" />
                          </colgroup>
                          <Table.Header>
                            <Table.Row>
                              <Table.HeaderCell>작성자</Table.HeaderCell>
                              <Table.HeaderCell>대댓글내용</Table.HeaderCell>
                              <Table.HeaderCell>등록일</Table.HeaderCell>
                              <Table.HeaderCell>대댓글 관리</Table.HeaderCell>
                            </Table.Row>
                          </Table.Header>
                          {(subComments &&
                            subComments.length &&
                            subComments.map((subComment, index) => (
                              <>
                                <Table.Body>
                                  <Table.Row>
                                    <Table.Cell>{subComment.writerName}</Table.Cell>
                                    <Table.Cell>{subComment.message}</Table.Cell>
                                    <Table.Cell>{subComment.timeString}</Table.Cell>
                                    <Table.Cell>
                                      {subComment.deleted ? (
                                        <>
                                          삭제 | {subComment.deletedTimeString} | {subComment.deleterName}
                                        </>
                                      ) : (
                                        <a
                                          style={{ cursor: 'pointer' }}
                                          onClick={() => removeSubComment(comment.id, subComment.id)}
                                        >
                                          삭제
                                        </a>
                                      )}
                                    </Table.Cell>
                                  </Table.Row>
                                </Table.Body>
                              </>
                            ))) ||
                            null}
                        </Table>
                        {(subTotalCount > subComments.length && (
                          <div className="center" style={{ padding: '10px' }}>
                            <a style={{ cursor: 'pointer' }} onClick={() => onAddSubComments(comment.id)}>
                              대댓글 더보기 +
                            </a>
                          </div>
                        )) ||
                          null}
                      </Table.Cell>
                    </Table.Row>
                  )) ||
                    null}
                </React.Fragment>
              );
            })
          ) : (
            <Table.Row>
              <Table.Cell textAlign="center" colSpan={10}>
                <div className="no-cont-wrap no-contents-icon">
                  <Icon className="no-contents80" />
                  <div className="sr-only">콘텐츠 없음</div>
                  <div className="text">검색 결과를 찾을 수 없습니다.</div>
                </div>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    );
  }
}

export default CommentListView;
