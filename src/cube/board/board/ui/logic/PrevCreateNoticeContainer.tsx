// import * as React from 'react';
// import { RouteComponentProps, withRouter } from 'react-router';
// import { Breadcrumb, Button, Container, Form, Header, Icon, Select, Table } from 'semantic-ui-react';
// import { inject, observer } from 'mobx-react';
// import DatePicker from 'react-datepicker';
// import moment, { Moment } from 'moment';
//
// import { patronInfo } from '@nara.platform/dock';
// import { reactAutobind, ReactComponent } from '@nara.platform/accent';
// import { FileBox, PatronType, ValidationType } from '@nara.drama/depot';
//
// import { PolyglotModel, SelectType } from 'shared/model';
// import { Polyglot } from 'shared/components';
// import { CrossEditorService } from 'shared/components/CrossEditor';
// import { PolyglotService, Language } from 'shared/components/Polyglot';
// import { AlertWin, ConfirmWin, DepotUtil } from 'shared/ui';
//
// import PostService from '../../../post/present/logic/PostService';
// import { serviceManagementUrl } from '../../../../../Routes';
// import { OpenState } from '../../../post/model/OpenState';
// import { PostModel } from '../../../post/model/PostModel';
//
// interface Props extends RouteComponentProps<{ cineroomId: string }> {}
//
// interface States {
//   alertWinOpen: boolean;
//   confirmWinOpen: boolean;
//   isBlankTarget: string;
//   alertIcon: string;
//   type: string;
//   title: string;
// }
//
// interface Injected {
//   postService: PostService;
//   crossEditorService: CrossEditorService;
//   polyglotService: PolyglotService;
// }
//
// @inject('postService', 'crossEditorService', 'polyglotService')
// @observer
// @reactAutobind
// class PrevCreateNoticeContainer extends ReactComponent<Props, States, Injected> {
//   //
//   crossEditorId = 'postCreate';
//
//   constructor(props: Props) {
//     super(props);
//     this.state = {
//       alertWinOpen: false,
//       confirmWinOpen: false,
//       isBlankTarget: '',
//       alertIcon: '',
//       type: '',
//       title: '',
//     };
//   }
//
//   componentDidMount() {
//     //
//     this.init();
//   }
//
//   init() {
//     //
//     const { postService } = this.injected;
//     const names = JSON.parse(patronInfo.getPatronName() || '') || '';
//     const email = patronInfo.getPatronEmail() || '';
//     const companyCode = patronInfo.getPatronCompanyCode() || '';
//     if (postService) {
//       postService.initPost();
//       postService.changePostProps('boardId', 'NTC');
//       //postService.changePostProps('writer.name', name);
//       const copiedValue = new PolyglotModel(postService.post.writer.name);
//       copiedValue.setValue(Language.En, names?.en);
//       copiedValue.setValue(Language.Ko, names?.ko);
//       copiedValue.setValue(Language.Zh, names?.zh);
//       postService.changePostProps('writer.name', copiedValue);
//
//       postService.changePostProps('writer.employeeId', companyCode);
//       postService.changePostProps('writer.email', email);
//     }
//   }
//
//   onChangerContentsProps(name: string, value: string | PolyglotModel) {
//     //
//     const { postService } = this.injected;
//     if (name === 'title' && value.length > 51) {
//       alert('????????? 50?????? ?????? ??? ????????????.');
//     }
//     if (postService) {
//       postService.changePostProps(name, value);
//     }
//   }
//
//   routeToPostList() {
//     //
//     this.props.history.push(
//       `/cineroom/${this.props.match.params.cineroomId}/${serviceManagementUrl}/boards/notice-list`
//     );
//   }
//
//   handleCloseAlertWin() {
//     //
//     this.setState({
//       alertWinOpen: false,
//     });
//   }
//
//   handleCloseConfirmWin() {
//     //
//     this.setState({
//       confirmWinOpen: false,
//     });
//   }
//
//   onChangePostPeriodProps(name: string, value: Moment) {
//     //
//     const { postService } = this.injected;
//     if (name === 'period.startDateMoment') postService!.changePostPeriodProps(name, value.startOf('day'));
//     if (name === 'period.endDateMoment') postService!.changePostPeriodProps(name, value.endOf('day'));
//   }
//
//   handleOKConfirmWin() {
//     //
//     const { postService } = this.injected;
//     const { post } = postService;
//     const names = JSON.parse(patronInfo.getPatronName() || '') || '';
//     const email = patronInfo.getPatronEmail() || '';
//     Promise.resolve()
//       .then(() => {
//         if (post.pinned) {
//           this.onChangerContentsProps('openState', OpenState.Opened);
//           //this.onChangerContentsProps('writer.name', name);
//           const copiedValue = new PolyglotModel(post.writer.name);
//           copiedValue.setValue(Language.En, names?.en);
//           copiedValue.setValue(Language.Ko, names?.ko);
//           copiedValue.setValue(Language.Zh, names?.zh);
//           this.onChangerContentsProps('writer.name', copiedValue);
//           this.onChangerContentsProps('writer.email', email);
//         }
//       })
//       .then(() => (postService && postService.registerPost(post)) || null)
//       .then(() => postService && postService.initPostContents())
//       .then(() => this.routeToPostList());
//   }
//
//   handleOk() {
//     //
//   }
//
//   handleSave() {
//     //
//     const { postService, crossEditorService, polyglotService } = this.injected;
//     const { post } = postService;
//
//     const crossEditorBodyValue = crossEditorService.getCrossEditorBodyValue(this.crossEditorId);
//     const currentLang = polyglotService.getActiveLan(this.crossEditorId);
//
//     if (currentLang) {
//       const copiedValue = new PolyglotModel(post.contents.contents);
//
//       copiedValue.setValue(currentLang, crossEditorBodyValue === '<p><br /></p>' ? '' : crossEditorBodyValue);
//       this.onChangerContentsProps('contents.contents', copiedValue);
//     }
//
//     if (PostModel.isBlankForNotice(post) === 'success') {
//       this.setState({ confirmWinOpen: true });
//     } else {
//       this.setState({
//         isBlankTarget: PostModel.isBlankForNotice(post),
//         alertWinOpen: true,
//       });
//     }
//   }
//
//   getFileBoxIdForReference(fileBoxId: string) {
//     //
//     const { postService } = this.injected;
//     const { post } = postService || ({} as PostService);
//     if (postService && post.contents) postService.changePostProps('contents.depotId', fileBoxId);
//   }
//
//   render() {
//     const { post } = this.injected.postService;
//     const { alertWinOpen, isBlankTarget, confirmWinOpen, alertIcon, type, title } = this.state;
//     return (
//       <Container fluid>
//         <div>
//           <Breadcrumb icon="right angle" sections={SelectType.sectionForCreateNotice} />
//           <Header as="h2">???????????? ??????</Header>
//         </div>
//         <div className="content">
//           <Form>
//             <Polyglot languages={post.langSupports}>
//               <Table celled>
//                 <colgroup>
//                   <col width="20%" />
//                   <col width="80%" />
//                 </colgroup>
//
//                 <Table.Header>
//                   <Table.Row>
//                     <Table.HeaderCell colSpan={2} className="title-header">
//                       ???????????? ??????
//                     </Table.HeaderCell>
//                   </Table.Row>
//                 </Table.Header>
//
//                 <Table.Body>
//                   <Table.Row>
//                     <Table.Cell className="tb-header">
//                       ?????? ?????? <span className="required">*</span>
//                     </Table.Cell>
//                     <Table.Cell>
//                       <Polyglot.Languages onChangeProps={this.onChangerContentsProps} />
//                     </Table.Cell>
//                   </Table.Row>
//                   <Table.Row>
//                     <Table.Cell className="tb-header">
//                       ?????? ?????? <span className="required">*</span>
//                     </Table.Cell>
//                     <Table.Cell>
//                       <Polyglot.Default onChangeProps={this.onChangerContentsProps} />
//                     </Table.Cell>
//                   </Table.Row>
//                   <Table.Row>
//                     <Table.Cell className="tb-header">??????</Table.Cell>
//                     <Table.Cell>
//                       {/*<Form.Field
//                         control={Input}
//                         placeholder="????????? ??????????????????."
//                         // maxLength={51}
//                         value={(post && post.title) || ''}
//                         onChange={(e: any) => this.onChangerContentsProps('title', e.target.value)}
//                       />*/}
//                       <Polyglot.Input
//                         languageStrings={post.title}
//                         name="title"
//                         onChangeProps={this.onChangerContentsProps}
//                         placeholder="????????? ??????????????????."
//                       />
//                     </Table.Cell>
//                   </Table.Row>
//                   <Table.Row>
//                     <Table.Cell className="tb-header">?????? ??????</Table.Cell>
//                     <Table.Cell>
//                       <Form.Group>
//                         <Form.Field
//                           control={Select}
//                           placeholder="Select"
//                           options={SelectType.noticeTypeForCreateNotice}
//                           value={post && post.pinned}
//                           onChange={(e: any, data: any) => {
//                             this.onChangerContentsProps('pinned', data.value);
//                           }}
//                         />
//                         {(post && post.pinned && (
//                           <Form.Field className="date-inline">
//                             <div className="ui input right icon">
//                               <DatePicker
//                                 placeholderText="??????????????? ??????????????????."
//                                 selected={(post && post.period && post.period.startDateObj) || ''}
//                                 onChange={(date: Date) =>
//                                   this.onChangePostPeriodProps('period.startDateMoment', moment(date))
//                                 }
//                                 minDate={new Date()}
//                                 dateFormat="yyyy.MM.dd"
//                               />
//                               <Icon name="calendar alternate outline" />
//                             </div>
//                             <div className="dash">-</div>
//                             <div className="ui input right icon">
//                               <DatePicker
//                                 placeholderText="?????????????????? ??????????????????."
//                                 selected={(post && post.period && post.period.endDateObj) || ''}
//                                 onChange={(date: Date) =>
//                                   this.onChangePostPeriodProps('period.endDateMoment', moment(date))
//                                 }
//                                 minDate={(post && post.period && post.period.startDateObj) || ''}
//                                 dateFormat="yyyy.MM.dd"
//                               />
//                               <Icon name="calendar alternate outline" />
//                             </div>
//                           </Form.Field>
//                         )) ||
//                           (post &&
//                             !post.pinned &&
//                             (this.onChangePostPeriodProps('period.startDateMoment', moment()),
//                             this.onChangePostPeriodProps('period.endDateMoment', moment())))}
//                       </Form.Group>
//                     </Table.Cell>
//                   </Table.Row>
//                   <Table.Row>
//                     <Table.Cell className="tb-header">??????</Table.Cell>
//                     <Table.Cell>
//                       <Polyglot.Editor
//                         name="contents.contents"
//                         languageStrings={post.contents.contents}
//                         onChangeProps={this.onChangerContentsProps}
//                       />
//                     </Table.Cell>
//                   </Table.Row>
//                   <Table.Row>
//                     <Table.Cell className="tb-header">????????????</Table.Cell>
//                     <Table.Cell>
//                       <div className="lg-attach">
//                         <div className="attach-inner">
//                           <FileBox
//                             id={post.contents.depotId}
//                             vaultKey={{ keyString: 'sku-depot', patronType: PatronType.Pavilion }}
//                             patronKey={{ keyString: 'sku-denizen', patronType: PatronType.Denizen }}
//                             validations={[
//                               { type: ValidationType.Duplication, validator: DepotUtil.duplicationValidator },
//                             ]}
//                             onChange={(fileBoxId) => this.getFileBoxIdForReference(fileBoxId)}
//                           />
//                           <div className="bottom">
//                             <span className="info-text1">
//                               <Icon className="info16" />
//                               <span className="blind">information</span>
//                               <p>?????? ??? ????????? ????????? ????????? ???????????????.</p>
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     </Table.Cell>
//                   </Table.Row>
//                 </Table.Body>
//               </Table>
//             </Polyglot>
//           </Form>
//           <div className="fl-right btn-group">
//             <Button onClick={this.routeToPostList} type="button">
//               ??????
//             </Button>
//             <Button primary onClick={this.handleSave} type="button">
//               ??????
//             </Button>
//           </div>
//           <AlertWin
//             message={isBlankTarget}
//             handleClose={this.handleCloseAlertWin}
//             handleOk={this.handleOk}
//             open={alertWinOpen}
//             alertIcon={alertIcon}
//             type={type}
//             title={title}
//           />
//           <ConfirmWin
//             message="?????????????????????????"
//             open={confirmWinOpen}
//             handleClose={this.handleCloseConfirmWin}
//             handleOk={this.handleOKConfirmWin}
//             title="?????? ??????"
//             buttonYesName="??????"
//             buttonNoName="??????"
//           />
//         </div>
//       </Container>
//     );
//   }
// }
//
// export default withRouter(PrevCreateNoticeContainer);
