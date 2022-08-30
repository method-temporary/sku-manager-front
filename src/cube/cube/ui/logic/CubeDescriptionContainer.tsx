// import * as React from 'react';
// import { inject, observer } from 'mobx-react';
// import { RouteComponentProps } from 'react-router';
// import { withRouter } from 'react-router-dom';
//
// import { MemberViewModel } from '@nara.drama/approval';
// import { PatronType, reactAutobind, ReactComponent } from '@nara.platform/accent';
//
// import { getPolyglotToAnyString } from 'shared/components/Polyglot';
//
// import CubeService from '../../present/logic/CubeService';
// import CubeDiscussionService from '../../../cubeDiscussion/present/logic/CubeDiscussionService';
// import BoardService from '../../../board/board/present/logic/BoardService';
// import { OperatorModel } from '../../../../community/community/model/OperatorModel';
// import CubeInstructorModel from '../../CubeInstructorModel';
//
// interface Props extends RouteComponentProps<Params> {
//   readonly?: boolean;
// }
//
// interface States {}
//
// interface Params {}
//
// interface Injected {
//   cubeService: CubeService;
//   cubeDiscussionService: CubeDiscussionService;
//   boardService: BoardService;
// }
//
// @inject('cubeService', 'cubeDiscussionService', 'boardService')
// @observer
// @reactAutobind
// class CubeDescriptionContainer extends ReactComponent<Props, States, Injected> {
//   //
//   componentDidMount() {}
//
//   onChangeCubeDescriptionProps(name: string, value: any): void {
//     //
//     const { cubeService } = this.injected;
//     // const invalid = value.length > 1000;
//     // if (invalid) {
//     //   console.log(value.length);
//     //   console.log(invalid);
//     //   return;
//     // }
//     cubeService.changeCubeProps(name, value);
//   }
//
//   onTextareaChange(name: string, value: any): void {
//     const { cubeService } = this.injected;
//     const invalid = value.length > 1000;
//
//     if (invalid) {
//       return;
//     }
//
//     cubeService.changeCubeProps(name, value);
//   }
//
//   handleCubeBoardChange(name: string, value: string | boolean) {
//     const { boardService } = this.injected;
//     boardService.changeBoardProps(name, value);
//   }
//
//   onChangeCubeBoardCountProps(name: string, value: string) {
//     let val = value;
//     if (val === '') {
//       val = '0';
//     } else if (value.startsWith('0') && value !== '0') {
//       val = value.substr(1);
//     }
//
//     this.handleCubeBoardChange(name, val);
//   }
//
//   setHourAndMinute(name: string, value: number) {
//     //
//     if (value < 0) value = 0;
//     const { cubeService } = this.injected;
//     const learningTime = cubeService.cube.learningTime;
//
//     let hours: number = parseInt(String(learningTime / 60), 10);
//     let minutes: number = parseInt(String(learningTime % 60), 10);
//
//     Promise.resolve()
//       .then(() => {
//         if (name === 'hour') {
//           if (value >= 1000) value = 999;
//           hours = value;
//         }
//         if (name === 'minute') {
//           if (value >= 60) value = 59;
//           minutes = value;
//         }
//       })
//       .then(() => this.setLearningTime(hours, minutes));
//   }
//
//   setLearningTime(hour: number, minute: number) {
//     //
//     const { cubeService } = this.injected;
//     const numberHour = Number(hour);
//     const numberMinute = Number(minute);
//     const newMinute = numberHour * 60 + numberMinute;
//     cubeService.changeCubeProps('learningTime', newMinute);
//   }
//
//   onSelectInstructor(instructor: CubeInstructorModel, name: string, value: boolean): void {
//     const { cubeService } = this.injected;
//     cubeService.cubeInstructors.forEach((cubeInstructor, index) => {
//       if (cubeInstructor.round === instructor.round) {
//         cubeService.changeTargetCubeInstructorProp(index, 'representative', false);
//       }
//     });
//
//     cubeService.changeTargetCubeInstructorProp(
//       cubeService.cubeInstructors.findIndex((target) => target.id === instructor.id),
//       name,
//       value
//     );
//   }
//
//   onDeleteInstructor(instructor: CubeInstructorModel): void {
//     const { cubeService } = this.injected;
//     cubeService.deleteTargetCubeInstructor(
//       cubeService.cubeInstructors.findIndex((target) => target.id === instructor.id)
//     );
//   }
//
//   handleManagerListModalOk(member: MemberViewModel) {
//     //
//     const { cubeService } = this.injected;
//
//     console.log(member);
//
//     console.log(getPolyglotToAnyString(MemberViewModel.name));
//     const operator = new OperatorModel({
//       employeeId: member.employeeId,
//       email: member.email,
//       company: member.companyCode,
//       name: getPolyglotToAnyString(member.name),
//       patronKey: { keyString: member.id, patronType: PatronType.Denizen },
//     });
//
//     cubeService.setCubeOperator(operator);
//   }
//
//   onChangeTargetInstructor(target: CubeInstructorModel, name: string, value: any): void {
//     const { cubeService } = this.injected;
//     const targetIndex = cubeService.cubeInstructors.findIndex(
//       (instructor) => instructor.id === target.id && instructor.round === target.round
//     );
//     if (value < 0) value = 0;
//     cubeService.changeTargetCubeInstructorProp(targetIndex, name, value);
//   }
//
//   handleCubeDiscussionChange(name: string, value: string | boolean) {
//     const { cubeDiscussionService } = this.injected;
//     cubeDiscussionService.changeCubeDiscussionProps(name, value);
//   }
//
//   onChangeCubeDiscussionCountProps(name: string, value: string) {
//     let val = value;
//     if (val === '') {
//       val = '0';
//     } else if (value.startsWith('0') && value !== '0') {
//       val = value.substr(1);
//     }
//     this.handleCubeDiscussionChange(name, val);
//   }
//
//   render() {
//     //
//     const { cubeService, cubeDiscussionService, boardService } = this.injected;
//     const { cube, cubeInstructors, cubeOperator } = cubeService;
//     const { board } = boardService;
//     const { cubeDiscussion } = cubeDiscussionService;
//     const { readonly } = this.props;
//
//     return (
//       <CubeDescriptionView
//         onChangeCubeDescriptionProps={this.onChangeCubeDescriptionProps}
//         handleCubeBoardChange={this.handleCubeBoardChange}
//         onChangeCubeBoardCountProps={this.onChangeCubeBoardCountProps}
//         handleCubeDiscussionChange={this.handleCubeDiscussionChange}
//         onChangeCubeDiscussionCountProps={this.onChangeCubeDiscussionCountProps}
//         onTextareaChange={this.onTextareaChange}
//         setHourAndMinute={this.setHourAndMinute}
//         handleManagerListModalOk={this.handleManagerListModalOk}
//         onChangeTargetInstructor={this.onChangeTargetInstructor}
//         onSelectInstructor={this.onSelectInstructor}
//         onDeleteInstructor={this.onDeleteInstructor}
//         cube={cube}
//         cubeInstructors={cubeInstructors}
//         cubeOperator={cubeOperator}
//         cubeDiscussion={cubeDiscussion}
//         board={board}
//         readonly={readonly}
//       />
//     );
//   }
// }
//
// export default withRouter(CubeDescriptionContainer);
