import * as React from 'react';
import { observer } from 'mobx-react';
import { Breadcrumb, Button, Header, Segment } from 'semantic-ui-react';
import ReactQuill from 'react-quill';

import { reactAutobind } from '@nara.platform/accent';

import { SelectType } from 'shared/model';
import { getDefaultLanguage, getPolyglotToAnyString } from 'shared/components/Polyglot';
import { ConfirmWin } from 'shared/ui';

import { PostModel } from '../../../../cube/board/post/model/PostModel';

interface Props {
  post: PostModel;
  handleDelete: () => void;
  routeToModifyFaq: (postId: string) => void;
  routeToPostList: () => void;
  handleCloseAlertWin: () => void;
  handleCloseConfirmWin: () => void;
  handleOKConfirmWin: () => void;
  isBlankTarget: string;
  alertWinOpen: boolean;
  confirmWinOpen: boolean;
}

@observer
@reactAutobind
class FaqDetailView extends React.Component<Props> {
  //
  render() {
    const {
      post,
      handleDelete,
      routeToModifyFaq,
      routeToPostList,
      handleCloseConfirmWin,
      handleOKConfirmWin,
      confirmWinOpen,
    } = this.props;
    return (
      <>
        <div>
          <Breadcrumb icon="right angle" sections={SelectType.leftHandSideExpressionBar} />
          <Header as="h2">FAQ 관리</Header>
        </div>
        <div className="content">
          <div className="post-detail">
            <Segment.Group>
              <Segment padded>
                <Header as="h2" textAlign="left">
                  {getPolyglotToAnyString(post.title, getDefaultLanguage(post.langSupports))}
                </Header>
                <div className="user-info">
                  <div className="ui profile">
                    <div className="pic" />
                  </div>
                  <span className="name">
                    {post.writer && getPolyglotToAnyString(post.writer.name, getDefaultLanguage(post.langSupports))}
                  </span>
                  <span className="name">{post.writer && post.writer.email}</span>
                  <span className="date">{post.registeredTime}</span>
                  <span className="date">&nbsp;&nbsp;{post.readCount && post.readCount} view</span>
                </div>
                <div className="post-section">
                  {(post.pinned && (
                    <span className="view-num">
                      &#10071;주요&nbsp;&nbsp; 게시기간: {post.period && post.period.startDateDot} ~{' '}
                      {post.period && post.period.endDateDot}
                    </span>
                  )) || <span className="name">일반</span>}
                </div>
                <div className="post-section">구분: {post.category && getPolyglotToAnyString(post.category.name)}</div>
              </Segment>
              <Segment>
                <ReactQuill
                  theme="bubble"
                  value={
                    getPolyglotToAnyString(
                      post.contents.contents[0]?.contents,
                      getDefaultLanguage(post.langSupports)
                    ) || ''
                  }
                  readOnly
                />
              </Segment>
            </Segment.Group>
          </div>
          <div className="btn-group">
            <Button onClick={handleDelete} type="button">
              삭제
            </Button>
            <div className="fl-right">
              <Button primary onClick={() => routeToModifyFaq(post.postId && post.postId)} type="button">
                수정
              </Button>
              <Button onClick={routeToPostList} type="button">
                목록
              </Button>
            </div>
          </div>
          {/*<AlertWin*/}
          {/*  message={isBlankTarget}*/}
          {/*  handleClose={handleCloseAlertWin}*/}
          {/*  open={alertWinOpen}*/}
          {/*/>*/}
          <ConfirmWin
            message="삭제하시겠습니까?"
            open={confirmWinOpen}
            handleClose={handleCloseConfirmWin}
            handleOk={handleOKConfirmWin}
            title="삭제 안내"
            buttonYesName="삭제"
            buttonNoName="취소"
          />
        </div>
      </>
    );
  }
}

export default FaqDetailView;
