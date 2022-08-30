// import * as React from 'react';
// import {
//   Button,
//   Modal,
//   Form,
//   Radio,
//   Checkbox,
//   Table,
//   Pagination,
//   Header,
//   Segment,
//   Input,
//   Dropdown,
// } from 'semantic-ui-react';
// import { inject, observer } from 'mobx-react';
// import { reactAutobind } from '@nara.platform/accent';
// import { InstructorModel, InstructorService } from 'instructor';
// import { SharedService } from 'shared/present';
// import { SelectType } from 'shared/model';
// import { InstructorWithUserIdentity } from '../../../../instructor/model/InstructorWithUserIdentity';
//
// interface Props {
//   open: boolean;
//   show: (open: boolean) => void;
//   setInstructorInCubeIntro?: (selectedInstructors: InstructorWithUserIdentity[]) => void;
//   setInstructorInClassroom?: (selectedInstructor: InstructorWithUserIdentity, type: string) => void;
//   setInstructorCoursePlanContents?: (selectedInstructor: InstructorWithUserIdentity) => void;
//   instructorService?: InstructorService;
//   sharedService?: SharedService;
//   type?: string;
//   multiple?: boolean;
//   onModalOpenCallback?: () => void;
// }
//
// interface States {
//   open: boolean;
// }
//
// @inject('instructorService', 'sharedService')
// @observer
// @reactAutobind
// class InstructorListModal extends React.Component<Props, States> {
//   //
//   constructor(props: Props) {
//     super(props);
//     this.state = { open: false };
//   }
//
//   componentDidMount() {
//     //
//     // this.clearInstructor();
//     // this.findAllInstructors();
//   }
//
//   findAllInstructors(page?: number) {
//     const { instructorService, sharedService } = this.props;
//     if (instructorService && sharedService) {
//       let offset = 0;
//       if (page) {
//         sharedService.setPage('instructor', page);
//         offset = (page - 1) * instructorService.instructorQuery.limit;
//         // this.setState({ pageIndex: (page - 1) * 20, currentPage: page });
//       } else {
//         sharedService.setPageMap('instructor', 0, instructorService.instructorQuery.limit);
//       }
//       instructorService.changeInstructorQueryProps('offset', offset);
//       instructorService
//         .findAllInstructors()
//         .then(() => sharedService.setCount('instructor', instructorService.instructors.length));
//       // .then(() => sharedService.setCount('instructor', instructorService.instructors._metadata.totalCount));
//     }
//   }
//
//   clearInstructor() {
//     //
//     const { instructorService } = this.props;
//     if (instructorService) instructorService.clearInstructor();
//   }
//
//   onChangeInstructorProps(name: string, value: string | boolean | number) {
//     //
//     const { instructorService } = this.props;
//     if (instructorService) instructorService.changeInstructorProps(name, value);
//   }
//
//   selectInstructorRow(selectedInstructor: InstructorWithUserIdentity, select?: boolean) {
//     const { instructor, userIdentity } = selectedInstructor;
//     const { multiple, instructorService } = this.props;
//     if (multiple === true) {
//       if (instructorService !== undefined) {
//         const { appendSelectedInstructor, removeSelectedInstructor } = instructorService;
//         if (select === true) {
//           appendSelectedInstructor(selectedInstructor);
//         } else {
//           removeSelectedInstructor(instructor.id);
//         }
//       }
//     } else {
//       this.onChangeInstructorProps('id', instructor.id);
//       this.onChangeInstructorProps('usid', instructor.id);
//       this.onChangeInstructorProps('employeeId', userIdentity.employeeId);
//       this.onChangeInstructorProps('memberSummary.email', userIdentity.email);
//       this.onChangeInstructorProps('memberSummary.name', userIdentity.name);
//       this.onChangeInstructorProps('memberSummary.department', userIdentity.department);
//       // this.onChangeInstructorProps('specialtyEnName', selectedInstructor.specialtyEnName);
//       this.onChangeInstructorProps('internal', instructor.internal);
//     }
//   }
//
//   onOpenModal() {
//     this.handleModalOpenCallback();
//     this.setState({
//       open: true,
//     });
//   }
//
//   onCloseModal() {
//     this.setState({
//       open: false,
//     });
//   }
//
//   handleSetInstructorInClassroom(selectedInstructor: InstructorWithUserIdentity, type: string) {
//     const { setInstructorInClassroom } = this.props;
//     if (setInstructorInClassroom) {
//       setInstructorInClassroom(selectedInstructor, type);
//     }
//     this.onCloseModal();
//   }
//
//   handleSetInstructorInCubeIntro(selectedInstructors: InstructorWithUserIdentity[]) {
//     const { setInstructorInCubeIntro } = this.props;
//     if (setInstructorInCubeIntro) setInstructorInCubeIntro(selectedInstructors);
//     this.onCloseModal();
//   }
//
//   handleOnSearch(internal: string, name: string) {
//     const { instructorService } = this.props;
//     if (instructorService) {
//       instructorService.changeInstructorQueryProps('internal', internal);
//       instructorService.changeInstructorQueryProps('name', name);
//       this.findAllInstructors(1);
//     }
//   }
//
//   handleModalOpenCallback() {
//     const { onModalOpenCallback } = this.props;
//     if (onModalOpenCallback) onModalOpenCallback();
//     //this.onCloseModal();
//   }
//
//   render() {
//     const { type, multiple } = this.props;
//     const { instructors, instructor: selectedInstructor, selectedInstructors } =
//       this.props.instructorService || ({} as InstructorService);
//     const { pageMap } = this.props.sharedService || ({} as SharedService);
//     const results = instructors;
//     const totalCount = instructors && instructors.length;
//
//     return (
//       <>
//         <React.Fragment>
//           {/* 강사선택 후 활성화 */}
//           {/*<span>SK C&C | 홍길동 | abc@sk.com</span>*/}
//           <Modal
//             size="small"
//             open={this.state.open}
//             onOpen={this.onOpenModal}
//             onClose={this.onCloseModal}
//             trigger={<Button type="button">강사 선택</Button>}
//           >
//             <InstrcutorListModalHeaderView onSearch={this.handleOnSearch} />
//             <Modal.Content className="fit-layout">
//               <Form>
//                 <Table>
//                   <colgroup>
//                     <col width="11%" />
//                     <col width="14%" />
//                     <col width="10%" />
//                     <col width="30%" />
//                     <col width="35%" />
//                   </colgroup>
//
//                   <Table.Header>
//                     <Table.Row>
//                       <Table.HeaderCell textAlign="center">Select</Table.HeaderCell>
//                       <Table.HeaderCell>성명</Table.HeaderCell>
//                       <Table.HeaderCell>사내/외</Table.HeaderCell>
//                       <Table.HeaderCell>소속정보</Table.HeaderCell>
//                       <Table.HeaderCell>카테고리</Table.HeaderCell>
//                     </Table.Row>
//                   </Table.Header>
//                   <Table.Body>
//                     {(results &&
//                       results.length &&
//                       results.map((result, index) => {
//                         const { instructor, userIdentity } = result;
//                         let checked = instructor.id === selectedInstructor.instructor.id;
//                         if (multiple === true) {
//                           checked = selectedInstructors.some((c) => c.instructor.id === instructor.id);
//                         }
//                         const onSelect = () => {
//                           if (multiple === true) {
//                             this.selectInstructorRow(result, !checked);
//                           } else {
//                             this.selectInstructorRow(result);
//                           }
//                         };
//                         return (
//                           <Table.Row key={index}>
//                             <Table.Cell textAlign="center">
//                               <Form.Field
//                                 control={multiple === true ? Checkbox : Radio}
//                                 value="1"
//                                 checked={checked}
//                                 onChange={onSelect}
//                               />
//                             </Table.Cell>
//                             <Table.Cell>{userIdentity.name}</Table.Cell>
//                             <Table.Cell textAlign="center">{instructor.internal ? '사내' : '사외'}</Table.Cell>
//                             <Table.Cell>{userIdentity.department}</Table.Cell>
//                             <Table.Cell>
//                               {instructor.collegeId}
//                               {/*&nbsp; &gt; &nbsp;*/}
//                               {/*{result.category && result.category.channel && result.category.channel.name}*/}
//                             </Table.Cell>
//                           </Table.Row>
//                         );
//                       })) ||
//                       null}
//                   </Table.Body>
//                 </Table>
//                 {totalCount === 0 ? null : (
//                   <div className="center pagination-area">
//                     <Pagination
//                       activePage={pageMap.get('instructor') ? pageMap.get('instructor').page : 1}
//                       totalPages={pageMap.get('instructor') ? pageMap.get('instructor').totalPages : 1}
//                       onPageChange={(e, data) => this.findAllInstructors(data.activePage as number)}
//                     />
//                   </div>
//                 )}
//               </Form>
//             </Modal.Content>
//             <Modal.Actions>
//               <Button className="w190 d" onClick={() => this.onCloseModal()} type="button">
//                 Cancel
//               </Button>
//               {type === 'classroom' ? (
//                 <Button
//                   className="w190 p"
//                   primary
//                   onClick={() => this.handleSetInstructorInClassroom(selectedInstructor, 'classroom')}
//                   type="button"
//                 >
//                   OK
//                 </Button>
//               ) : (
//                 <Button
//                   className="w190 p"
//                   onClick={() => this.handleSetInstructorInCubeIntro(selectedInstructors)}
//                   type="button"
//                 >
//                   OK
//                 </Button>
//               )}
//             </Modal.Actions>
//           </Modal>
//         </React.Fragment>
//       </>
//     );
//   }
// }
//
// interface InstructorListModalHeaderViewProps {
//   onSearch: (internal: string, name: string) => void;
// }
//
// const InstrcutorListModalHeaderView = ({ onSearch }: InstructorListModalHeaderViewProps) => {
//   const [internal, setInternal] = React.useState('-');
//   const [name, setName] = React.useState('');
//   const handleInternalDivisionChange = (e: any, data: any) => {
//     setInternal(data.value);
//   };
//   const handleSearchKeyDown = (e: any) => {
//     if (e.key === 'Enter') {
//       onSearch(internal === '*' ? '' : internal, name);
//     }
//   };
//   const handleSearchKeyChange = (e: any, data: any) => {
//     setName(data.value);
//   };
//
//   return (
//     <Segment vertical clearing style={{ padding: '1rem 1rem 0 1.5rem' }}>
//       <Header as="h5" floated="right">
//         <Form.Field inline>
//           <Dropdown
//             selection
//             options={SelectType.instructorInternalDivision}
//             defaultValue="*"
//             onChange={handleInternalDivisionChange}
//           />
//           <Input
//             icon="search"
//             width={2}
//             placeholder="Search..."
//             onChange={handleSearchKeyChange}
//             onKeyDown={handleSearchKeyDown}
//           />
//         </Form.Field>
//       </Header>
//       <Header floated="left" aligned="center" style={{ paddingTop: '0.5rem' }}>
//         강사 선택
//       </Header>
//     </Segment>
//   );
// };
//
// export default InstructorListModal;
