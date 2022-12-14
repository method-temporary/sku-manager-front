// import * as React from 'react';
// import { inject, observer } from 'mobx-react';
// import { RouteComponentProps, withRouter } from 'react-router';
// import { Container } from 'semantic-ui-react';
//
// import depot from '@nara.drama/depot';
// import { reactAutobind, ReactComponent } from '@nara.platform/accent';
//
// import { alert, AlertModel, confirm, ConfirmModel } from 'shared/components';
// import { getDefaultLanguage } from 'shared/components/Polyglot';
// import { CrossEditorService } from 'shared/components/CrossEditor';
//
// import { serviceManagementUrl } from '../../../../../Routes';
//
// import { OpenState } from '../../../post/model/OpenState';
// import PostService from '../../../post/present/logic/PostService';
// import PrevNoticeDetailView from '../view/PrevNoticeDetailView';
//
// interface Params {
//   cineroomId: string;
//   postId: string;
// }
//
// interface Props extends RouteComponentProps<Params> {}
//
// interface States {
//   filesMap: Map<string, any>;
// }
//
// interface Injected {
//   postService: PostService;
//   crossEditorService: CrossEditorService;
// }
//
// @inject('postService', 'crossEditorService')
// @observer
// @reactAutobind
// class PrevNoticeDetailContainer extends ReactComponent<Props, States, Injected> {
//   //
//   crossEditorId = 'noticeDetail';
//
//   constructor(props: Props) {
//     super(props);
//     this.state = {
//       filesMap: new Map<string, any>(),
//     };
//   }
//
//   componentDidMount(): void {
//     //
//     this.init();
//   }
//
//   init() {
//     //
//     const { postService, crossEditorService } = this.injected;
//     const { postId } = this.props.match.params;
//     const { post } = postService;
//
//     Promise.resolve().then(() => {
//       if (postService) {
//         postService.findPostByPostId(postId).then(() => {
//           this.getFileIds();
//         });
//       }
//     });
//   }
//
//   getFileIds() {
//     //
//     const { post } = this.injected.postService;
//     const referenceFileBoxId = post && post.contents && post.contents.depotId;
//     if (referenceFileBoxId) {
//       this.findFiles('reference', referenceFileBoxId);
//     }
//   }
//
//   findFiles(type: string, fileBoxId: string) {
//     const { filesMap } = this.state;
//     return depot.getDepotFiles(fileBoxId).then((files) => {
//       filesMap.set(type, files);
//       const newMap = new Map(filesMap.set(type, files));
//       this.setState({ filesMap: newMap });
//     });
//   }
//
//   routeToPostList() {
//     //
//     this.props.history.push(
//       `/cineroom/${this.props.match.params.cineroomId}/${serviceManagementUrl}/boards/notice-list`
//     );
//   }
//
//   routeToModifyNotice(postId: string) {
//     //
//     this.props.history.push(
//       `/cineroom/${this.props.match.params.cineroomId}/${serviceManagementUrl}/boards/notice-modify/${postId}`
//     );
//   }
//
//   onChangePostProps(name: string, value: string) {
//     //
//     const { postService } = this.injected;
//     const { postId } = this.props.match.params;
//     if (postService) {
//       Promise.resolve()
//         .then(() => postService.changePostProps(name, value))
//         .then(() => postService.modifyPost(postId, postService.post))
//         .then(() => {
//           alert(
//             AlertModel.getCustomAlert(
//               false,
//               '??????',
//               value === OpenState.Opened ? '?????? ?????? ?????????????????????.' : '?????? ????????? ?????????????????????.',
//               '??????',
//               this.routeToPostList
//             )
//           );
//         });
//     }
//   }
//
//   onClickOkForEnrollment() {
//     //
//     this.onChangePostProps('openState', OpenState.Opened);
//   }
//
//   onClickCloseForEnrollment() {
//     //
//     this.onChangePostProps('openState', OpenState.Closed);
//   }
//
//   deleteNotice() {
//     //
//     const { postService } = this.injected;
//     const { postId } = this.props.match.params;
//     Promise.resolve()
//       .then(() => postService && postService.changePostProps('deleted', String(true)))
//       .then(() => postService && postService.modifyPost(postId, postService.post))
//       .then(() => this.routeToPostList());
//   }
//
//   onClickDelete() {
//     //
//     confirm(ConfirmModel.getRemoveConfirm(this.deleteNotice));
//   }
//
//   changeDateToString(date: Date) {
//     //
//     let month = '' + (date.getMonth() + 1);
//     let day = '' + date.getDate();
//     const year = date.getFullYear();
//
//     if (month.length < 2) {
//       month = '0' + month;
//     }
//     if (day.length < 2) {
//       day = '0' + day;
//     }
//     return [year, month, day].join('.');
//   }
//
//   render() {
//     const { post } = this.injected.postService;
//     const { filesMap } = this.state;
//
//     const defaultLanguage = getDefaultLanguage(post.langSupports);
//
//     return (
//       <Container fluid>
//         <PrevNoticeDetailView
//           post={post}
//           onClickDelete={this.onClickDelete}
//           routeToPostList={this.routeToPostList}
//           routeToModifyNotice={this.routeToModifyNotice}
//           onClickOkForEnrollment={this.onClickOkForEnrollment}
//           onClickCloseForEnrollment={this.onClickCloseForEnrollment}
//           filesMap={filesMap}
//           crossEditorId={this.crossEditorId}
//           changeDateToString={this.changeDateToString}
//         />
//       </Container>
//     );
//   }
// }
//
// export default withRouter(PrevNoticeDetailContainer);
