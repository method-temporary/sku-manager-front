// import * as React from 'react';
// import { observer } from 'mobx-react';
// import { Breadcrumb, Button, Header, Segment } from 'semantic-ui-react';
// import ReactQuill from 'react-quill';
//
// import { reactAutobind } from '@nara.platform/accent';
// import depot, { DepotFileViewModel } from '@nara.drama/depot';
//
// import { SelectType } from 'shared/model';
// import { getDefaultLanguage, getPolyglotToAnyString } from 'shared/components/Polyglot';
//
// import { OpenState } from '../../../post/model/OpenState';
// import { PostModel } from '../../../post/model/PostModel';
//
// interface Props {
//   post: PostModel;
//   onClickDelete: () => void;
//   routeToPostList: () => void;
//   routeToModifyNotice: (postId: string) => void;
//   onClickOkForEnrollment: () => void;
//   onClickCloseForEnrollment: () => void;
//   filesMap: Map<string, any>;
//   crossEditorId: string;
//   changeDateToString: (date: Date) => string;
// }
//
// @observer
// @reactAutobind
// class PrevNoticeDetailView extends React.Component<Props> {
//   //
//   render() {
//     const {
//       post,
//       onClickDelete,
//       routeToPostList,
//       routeToModifyNotice,
//       onClickOkForEnrollment,
//       onClickCloseForEnrollment,
//       filesMap,
//       crossEditorId,
//       changeDateToString,
//     } = this.props;
//
//     return (
//       <>
//         <div>
//           <Breadcrumb icon="right angle" sections={SelectType.leftHandSideExpressionBar} />
//           <Header as="h2">공지사항 관리</Header>
//         </div>
//         <div className="content">
//           <div className="post-detail">
//             <Segment.Group>
//               <Segment padded>
//                 <Header as="h2" textAlign="left">
//                   {getPolyglotToAnyString(post.title, getDefaultLanguage(post.langSupports))}
//                 </Header>
//                 <div className="user-info">
//                   <div className="ui profile">
//                     <div className="pic" />
//                   </div>
//                   <span className="name">
//                     {post.writer && getPolyglotToAnyString(post.writer.name, getDefaultLanguage(post.langSupports))}{' '}
//                     &nbsp;&nbsp;
//                   </span>
//                   <span className="name">{post.writer && post.writer.email} &nbsp;&nbsp;</span>
//                   <span className="date">
//                     {changeDateToString(new Date(post.registeredTime))}&nbsp;
//                     {new Date(post.registeredTime).toLocaleTimeString('en-GB').substring(0, 5)}
//                   </span>
//                   <span className="date">&nbsp;&nbsp;{post.readCount && post.readCount} view&nbsp;&nbsp;</span>
//                   {(post.openState && post.openState === 'Created' && <span className="date">작성&nbsp;&nbsp;</span>) ||
//                     (post.openState && post.openState === 'Opened' && <span className="date">게시&nbsp;&nbsp;</span>) ||
//                     (post.openState && post.openState === 'Closed' && (
//                       <span className="date">게시취소&nbsp;&nbsp;</span>
//                     )) ||
//                     ''}
//                   {post.pinned && (
//                     <span className="date">
//                       게시기간 : {post.period && post.period.startDateDot} ~ {post.period && post.period.endDateDot}{' '}
//                     </span>
//                   )}
//                 </div>
//               </Segment>
//               <Segment>
//                 <ReactQuill
//                   theme="bubble"
//                   value={getPolyglotToAnyString(post.contents.contents, getDefaultLanguage(post.langSupports)) || ''}
//                   readOnly
//                 />
//                 {/*<CrossEditor*/}
//                 {/*  id={crossEditorId}*/}
//                 {/*  value={getPolyglotToAnyString(post.contents.contents, getDefaultLanguage(post.langSupports)) || ''}*/}
//                 {/*  readonly*/}
//                 {/*/>*/}
//               </Segment>
//               <Segment basic>
//                 <div className="file">
//                   <strong>첨부파일 :</strong>
//                   {(filesMap &&
//                     filesMap.get('reference') &&
//                     filesMap.get('reference').map((foundedFile: DepotFileViewModel, index: number) => (
//                       <a href="#" className="link" key={index}>
//                         <span className="ellipsis" onClick={() => depot.downloadDepotFile(foundedFile.id)}>
//                           {foundedFile.name}
//                         </span>
//                       </a>
//                     ))) ||
//                     '-'}
//                 </div>
//               </Segment>
//             </Segment.Group>
//           </div>
//           <div className="btn-group">
//             <Button onClick={onClickDelete}>삭제</Button>
//             <div className="fl-right">
//               <Button onClick={routeToPostList}>목록</Button>
//               <Button primary onClick={() => routeToModifyNotice(post.postId && post.postId)}>
//                 수정
//               </Button>
//
//               {(post && (post.openState === OpenState.Created || post.openState === OpenState.Closed) && (
//                 <Button primary onClick={onClickOkForEnrollment}>
//                   게시
//                 </Button>
//               )) ||
//                 (post && post.openState === OpenState.Opened && (
//                   <Button primary onClick={onClickCloseForEnrollment}>
//                     게시취소
//                   </Button>
//                 ))}
//             </div>
//           </div>
//         </div>
//       </>
//     );
//   }
// }
//
// export default PrevNoticeDetailView;
