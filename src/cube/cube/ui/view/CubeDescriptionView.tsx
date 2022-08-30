// import * as React from 'react';
// import { observer } from 'mobx-react';
// import { Form, Input, Select, Radio } from 'semantic-ui-react';
// import moment from 'moment';
//
// import { MemberViewModel } from '@nara.drama/approval';
// import { reactAutobind, ReactComponent } from '@nara.platform/accent';
//
// import { FormTable, Polyglot } from 'shared/components';
// import { SelectType, CubeType } from 'shared/model';
//
// import { OperatorModel } from '../../../../community/community/model/OperatorModel';
// import ContentsProviderSelectContainer from '../../../media/ui/logic/ContentsProviderSelectContainer';
// import { CubeDiscussionModel } from '../../../cubeDiscussion/model/CubeDiscussionModel';
// import CubeInstructorModel from '../../CubeInstructorModel';
// import { BoardModel } from '../../../board/board/model/BoardModel';
// import { CubeModel } from '../../model/CubeModel';
// import CubeInstructorInfoView from './CubeInstructorInfoView';
// import ManagerListModalView from './ManagerListModal';
// import CubeManagerInfoView from './CubeManagerInfoView';
//
// interface Props {
//   onChangeCubeDescriptionProps: (name: string, value: any) => void;
//   handleCubeBoardChange: (name: string, value: string | boolean) => void;
//   onChangeCubeBoardCountProps: (name: string, value: any) => void;
//   handleCubeDiscussionChange: (name: string, value: string | boolean) => void;
//   onChangeCubeDiscussionCountProps: (name: string, value: string) => void;
//   onTextareaChange: (name: string, value: any) => void;
//   setHourAndMinute: (name: string, value: number) => void;
//   handleManagerListModalOk: (member: MemberViewModel) => void;
//   onChangeTargetInstructor: (instructor: CubeInstructorModel, name: string, value: any) => void;
//   onSelectInstructor: (instructor: CubeInstructorModel, name: string, value: boolean) => void;
//   onDeleteInstructor: (instructor: CubeInstructorModel) => void;
//
//   cubeInstructors: CubeInstructorModel[];
//   cubeOperator: OperatorModel;
//   cube: CubeModel;
//   cubeDiscussion: CubeDiscussionModel;
//   board: BoardModel;
//   readonly?: boolean;
// }
//
// interface States {}
//
// @observer
// @reactAutobind
// class CubeDescriptionView extends ReactComponent<Props, States> {
//   //
//   // //교육내용 ReactQuill 객체
//   // eduDescriptionQuillRef: any = null;
//   //
//   // //기타안내 ReactQuill 객체
//   // etcGuideQuillRef: any = null;
//
//   componentDidMount(): void {
//     //
//     // this.setHtmlEditorLengthLimit();
//   }
//
//   // setHtmlEditorLengthLimit() {
//   //   if (!this.props.readonly && this.eduDescriptionQuillRef && this.etcGuideQuillRef) {
//   //     const cubeDescriptionQuillEditor = this.eduDescriptionQuillRef.getEditor();
//   //     cubeDescriptionQuillEditor.on('text-change', (delta: { ops: any }, old: any, source: any) => {
//   //       const charLen = cubeDescriptionQuillEditor.getLength();
//   //       if (charLen > 1000) {
//   //         cubeDescriptionQuillEditor.deleteText(1000, charLen);
//   //       }
//   //     });
//   //
//   //     const cubeEtcDataQuillEditor = this.etcGuideQuillRef.getEditor();
//   //     cubeEtcDataQuillEditor.on('text-change', (delta: { ops: any }, old: any, source: any) => {
//   //       const charLen = cubeEtcDataQuillEditor.getLength();
//   //       if (charLen > 1000) {
//   //         cubeEtcDataQuillEditor.deleteText(1000, charLen);
//   //       }
//   //     });
//   //   }
//   // }
//
//   render() {
//     //
//     const {
//       onChangeCubeDescriptionProps,
//       handleCubeBoardChange,
//       onChangeCubeBoardCountProps,
//       handleCubeDiscussionChange,
//       onChangeCubeDiscussionCountProps,
//       onTextareaChange,
//       setHourAndMinute,
//       handleManagerListModalOk,
//       cubeOperator,
//       onChangeTargetInstructor,
//       onSelectInstructor,
//       onDeleteInstructor,
//       cubeInstructors,
//       cube,
//       cubeDiscussion,
//       board,
//       readonly,
//     } = this.props;
//
//     // this.setHtmlEditorLengthLimit();
//
//     //교육목표 글자수(100자 이내)
//     // const goalLength =
//     //   (cube &&
//     //     cube.cubeContents &&
//     //     cube.cubeContents.description &&
//     //     cube.cubeContents.description.goal &&
//     //     cube.cubeContents.description.goal.length) ||
//     //   0;
//     //
//     // //교육대상 글자수(100자 이내)
//     // const applicantsLength =
//     //   (cube &&
//     //     cube.cubeContents &&
//     //     cube.cubeContents.description &&
//     //     cube.cubeContents.description.applicants &&
//     //     cube.cubeContents.description.applicants.length) ||
//     //   0;
//     //
//     // //이수조건 글자수(1000자 이내)
//     // const completionTermsLength =
//     //   (cube &&
//     //     cube.cubeContents &&
//     //     cube.cubeContents.description &&
//     //     cube.cubeContents.description.completionTerms &&
//     //     cube.cubeContents.description.completionTerms.length) ||
//     //   0;
//
//     // 운영서버 반영 시 날짜 변경 2021.05.20 18:00
//     const checkTaskUsingDate = moment(1621501200000);
//     const checkTaskUsingAutomaticCompletion =
//       cube.registeredTime !== 0 && moment(cube.registeredTime).diff(checkTaskUsingDate, 'days', true) < 0;
//
//     return <FormTable title="교육 정보"></FormTable>;
//   }
// }
//
// export default CubeDescriptionView;
