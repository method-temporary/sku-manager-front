// /* eslint-disable */
// import * as React from 'react';
// import { observer } from 'mobx-react';
// import { reactAutobind } from '@nara.platform/accent';
// import { Form, Input, Table } from 'semantic-ui-react';
// import { ClassroomGroupModel } from '../../model/sdo/ClassroomGroupModel';
// import { ClassroomModel } from '../../model/ClassroomModel';
//
// interface Props {
//   classroomGroup: ClassroomGroupModel;
//   changeClassroomCdoProps: (index: number, name: string, value: string) => void;
//   type?: string;
//   filesMap: Map<string, any>;
//   onClickTest: (paperId: string) => void;
//   onClickSurveyForm: (surveyFormId: string) => void;
// }
//
// @observer
// @reactAutobind
// class ClassroomDetailView extends React.Component<Props> {
//   //
//   compare(classroom1: ClassroomModel, classroom2: ClassroomModel) {
//     if (classroom1.round > classroom2.round) return 1;
//     return -1;
//   }
//
//   render() {
//     const { classroomGroup, changeClassroomCdoProps, type, filesMap, onClickTest, onClickSurveyForm } = this.props;
//
//     let classrooms: ClassroomModel[] = [];
//     if (classroomGroup && classroomGroup.classroomCdos && classroomGroup.classroomCdos.length) {
//       classrooms = classroomGroup.classroomCdos.sort(this.compare);
//     }
//
//     const fileList = filesMap.get('classroom');
//     return (
//       <Table celled>
//         <colgroup>
//           <col width="20%" />
//           <col width="80%" />
//         </colgroup>
//         <Table.Header>
//           <Table.Row>
//             <Table.HeaderCell colSpan={2} className="title-header">
//               부가 정보
//             </Table.HeaderCell>
//           </Table.Row>
//         </Table.Header>
//         <Table.Body>
//           <Table.Row>
//             <Table.Cell>차수정보</Table.Cell>
//             <Table.Cell>
//               {classrooms.map((classroom, index) => (
//                 <Table celled key={index}>
//                   <colgroup>
//                     <col width="25%" />
//                     <col width="75%" />
//                   </colgroup>
//                   <Table.Body>
//                     <Table.Row>
//                       <Table.Cell className="tb-header">차수정보</Table.Cell>
//                       <Table.Cell>{classroom.round}</Table.Cell>
//                     </Table.Row>
//                     <Table.Row>
//                       <Table.Cell className="tb-header">신청기간</Table.Cell>
//                       <Table.Cell>
//                         <span>
//                           {(classroom &&
//                             classroom.enrolling &&
//                             classroom.enrolling.applyingPeriod &&
//                             classroom.enrolling.applyingPeriod.startDate) ||
//                             ''}
//                         </span>
//                         <span className="dash">~</span>
//                         <span>
//                           {(classroom &&
//                             classroom.enrolling &&
//                             classroom.enrolling.applyingPeriod &&
//                             classroom.enrolling.applyingPeriod.endDate) ||
//                             ''}
//                         </span>
//                       </Table.Cell>
//                     </Table.Row>
//                     <Table.Row>
//                       <Table.Cell className="tb-header">학습시작일 및 종료일</Table.Cell>
//                       <Table.Cell>
//                         <span>
//                           {(classroom &&
//                             classroom.enrolling &&
//                             classroom.enrolling.learningPeriod &&
//                             classroom.enrolling.learningPeriod.startDate) ||
//                             ''}
//                         </span>
//                         <span className="dash">~</span>
//                         <span>
//                           {(classroom &&
//                             classroom.enrolling &&
//                             classroom.enrolling.learningPeriod &&
//                             classroom.enrolling.learningPeriod.endDate) ||
//                             ''}
//                         </span>
//                       </Table.Cell>
//                     </Table.Row>
//                     <Table.Row>
//                       <Table.Cell className="tb-header">교육장소</Table.Cell>
//                       <Table.Cell>
//                         <Form.Field>
//                           {(classroom && classroom.operation && classroom.operation.location) || ''}
//                         </Form.Field>
//                       </Table.Cell>
//                     </Table.Row>
//                     {/* 과제, Survey, Test 안쓴다 */}
//                     {/* <Table.Row>
//                       <Table.Cell className="tb-header">과제 유무</Table.Cell>
//                       <Table.Cell>
//                         {classroom.fileBoxId ? (
//                           <Table celled>
//                             <colgroup>
//                               <col width="80%" />
//                               <col width="20%" />
//                             </colgroup>
//                             <Table.Header>
//                               <Table.Row>
//                                 <Table.HeaderCell textAlign="center">
//                                   파일명
//                                 </Table.HeaderCell>
//                               </Table.Row>
//                             </Table.Header>
//                             <Table.Body>
//                               <Table.Row>
//                                 <Table.Cell>
//                                   {fileList && fileList.length > 0 ? (
//                                     fileList
//                                       .filter((data: any) => {
//                                         return (
//                                           data.depotId ===
//                                           classroom.roundReportFileBox.fileBoxId
//                                         );
//                                       })
//                                       .map(
//                                         (foundedFile: DepotFileViewModel) => (
//                                           <p key={index}>
//                                             <a
//                                               onClick={() =>
//                                                 depot.downloadDepotFile(
//                                                   foundedFile.instructorId
//                                                 )
//                                               }
//                                             >
//                                               {foundedFile.name}
//                                             </a>
//                                           </p>
//                                         )
//                                       )
//                                   ) : (
//                                     <>-</>
//                                   )}
//                                 </Table.Cell>
//                               </Table.Row>
//                             </Table.Body>
//                           </Table>
//                         ) : (
//                           '-'
//                         )}
//                       </Table.Cell>
//                     </Table.Row> */}
//                     <Table.Row>
//                       <Table.Cell className="tb-header">Class Capacity Info</Table.Cell>
//                       <Table.Cell>
//                         <Form.Field>{(classroom && classroom.capacity) || ''}</Form.Field>
//                       </Table.Cell>
//                     </Table.Row>
//                     <Table.Row>
//                       <Table.Cell className="tb-header">취소가능기간</Table.Cell>
//                       <Table.Cell>
//                         <span>
//                           {(classroom &&
//                             classroom.enrolling &&
//                             classroom.enrolling.cancellablePeriod &&
//                             classroom.enrolling.cancellablePeriod.startDate) ||
//                             ''}
//                         </span>
//                         <span className="dash">~</span>
//                         <span>
//                           {(classroom &&
//                             classroom.enrolling &&
//                             classroom.enrolling.cancellablePeriod &&
//                             classroom.enrolling.cancellablePeriod.endDate) ||
//                             ''}
//                         </span>
//                       </Table.Cell>
//                     </Table.Row>
//                     <Table.Row>
//                       <Table.Cell className="tb-header">취소 시 패널티</Table.Cell>
//                       {type ? (
//                         <Table.Cell>
//                           {(classroom && classroom.enrolling && classroom.enrolling.cancellationPenalty) || ''}
//                         </Table.Cell>
//                       ) : (
//                         <Table.Cell>
//                           <Form.Field
//                             fluid
//                             control={Input}
//                             placeholder="취소 시 패널티 정보를 입력해주세요."
//                             value={(classroom && classroom.enrolling && classroom.enrolling.cancellationPenalty) || ''}
//                             onChange={(e: any) =>
//                               changeClassroomCdoProps(index, 'enrolling.cancellationPenalty', e.target.value)
//                             }
//                           />
//                         </Table.Cell>
//                       )}
//                     </Table.Row>
//                     <Table.Row>
//                       <Table.Cell className="tb-header">외부과정 URL</Table.Cell>
//                       <Table.Cell>
//                         {classroom && classroom.operation && classroom.operation.siteUrl ? (
//                           <a href={classroom.operation.siteUrl}>{classroom.operation.siteUrl}</a>
//                         ) : (
//                           '-'
//                         )}
//                       </Table.Cell>
//                     </Table.Row>
//                     <Table.Row>
//                       <Table.Cell className="tb-header">Free/Paid</Table.Cell>
//                       <Table.Cell>
//                         <Form.Group>
//                           <Form.Field>
//                             {classroom && classroom.freeOfCharge && classroom.freeOfCharge.freeOfCharge
//                               ? 'Free'
//                               : 'Paid' || null}
//                           </Form.Field>
//                           <Form.Field>
//                             {(classroom && classroom.freeOfCharge && classroom.freeOfCharge.chargeAmount) || null}
//                           </Form.Field>
//                         </Form.Group>
//                       </Table.Cell>
//                     </Table.Row>
//                     <Table.Row>
//                       <Table.Cell className="tb-header">수강신청 유/무</Table.Cell>
//                       {classroom && classroom.enrolling && classroom.enrolling.enrollingAvailable ? (
//                         <Table.Cell>Yes</Table.Cell>
//                       ) : (
//                         <Table.Cell>No</Table.Cell>
//                       )}
//                     </Table.Row>
//                     <Table.Row>
//                       <Table.Cell className="tb-header">
//                         승인프로세스 여부
//                         <span className="required">*</span>
//                       </Table.Cell>
//                       {classroom && classroom.freeOfCharge && classroom.freeOfCharge.approvalProcess ? (
//                         <Table.Cell>Yes</Table.Cell>
//                       ) : (
//                         <Table.Cell>No</Table.Cell>
//                       )}
//                     </Table.Row>
//                     <Table.Row>
//                       <Table.Cell className="tb-header">
//                         메일발송 여부
//                         <span className="required">*</span>
//                       </Table.Cell>
//                       {classroom && classroom.freeOfCharge.sendmailFlag ? (
//                         <Table.Cell>Yes</Table.Cell>
//                       ) : (
//                         <Table.Cell>No</Table.Cell>
//                       )}
//                     </Table.Row>
//                     {/* 과제, Survey, Test 안쓴다 */}
//                     {/* <Table.Row>
//                       <Table.Cell className="tb-header">Survey</Table.Cell>
//                       <Table.Cell>
//                         {classroom.roundSurveyId ? (
//                           <Table celled>
//                             <colgroup>
//                               <col width="70%" />
//                               <col width="30%" />
//                             </colgroup>
//                             <Table.Header>
//                               <Table.Row>
//                                 <Table.HeaderCell textAlign="center">
//                                   Survey Title
//                                 </Table.HeaderCell>
//                                 <Table.HeaderCell textAlign="center">
//                                   설문 Writer
//                                 </Table.HeaderCell>
//                               </Table.Row>
//                             </Table.Header>
//                             <Table.Body>
//                               <SurveyModal
//                                 surveyId={classroom.roundSurveyId}
//                                 trigger={
//                                   <Table.Row
//                                     className="pointer"
//                                     onClick={() =>
//                                       onClickSurveyForm(classroom.roundSurveyId)
//                                     }
//                                   >
//                                     <Table.Cell>
//                                       {classroom.roundSurveyTitle || '-'}
//                                     </Table.Cell>
//                                     <Table.Cell>
//                                       {classroom.roundSurveyAuthorName || '-'}
//                                     </Table.Cell>
//                                   </Table.Row>
//                                 }
//                               />
//                             </Table.Body>
//                           </Table>
//                         ) : (
//                           '-'
//                         )}
//                       </Table.Cell>
//                     </Table.Row> */}
//                     {/* 과제, Survey, Test 안쓴다 */}
//                     {/* <Table.Row>
//                       <Table.Cell className="tb-header">Test</Table.Cell>
//                       <Table.Cell>
//                         {classroom.roundPaperId ? (
//                           <Table celled>
//                             <colgroup>
//                               <col width="70%" />
//                               <col width="30%" />
//                             </colgroup>
//                             <Table.Header>
//                               <Table.Row>
//                                 <Table.HeaderCell textAlign="center">
//                                   시험 제목
//                                 </Table.HeaderCell>
//                                 <Table.HeaderCell textAlign="center">
//                                   합격 점수
//                                 </Table.HeaderCell>
//                               </Table.Row>
//                             </Table.Header>
//                             <Table.Body>
//                               <ExamDetailModal
//                                 paperId={classroom.roundPaperId}
//                                 trigger={
//                                   <Table.Row
//                                     className="pointer"
//                                     onClick={() =>
//                                       onClickTest(classroom.roundPaperId)
//                                     }
//                                   >
//                                     <Table.Cell>
//                                       {classroom.roundExamTitle || '-'}{' '}
//                                     </Table.Cell>
//                                     <Table.Cell>
//                                       {(classroom &&
//                                         classroom.examinationCdo &&
//                                         classroom.examinationCdo
//                                           .successPoint) ||
//                                         '-'}
//                                     </Table.Cell>
//                                   </Table.Row>
//                                 }
//                               />
//                             </Table.Body>
//                           </Table>
//                         ) : (
//                           '-'
//                         )}
//                       </Table.Cell>
//                     </Table.Row> */}
//                     <Table.Row>
//                       <Table.Cell className="tb-header">강사 정보</Table.Cell>
//                       <Table.Cell>
//                         {classroom.instructor && classroom.instructor.usid ? (
//                           <Table celled>
//                             {classroom &&
//                             classroom.instructor &&
//                             classroom.instructor &&
//                             classroom.instructor.employeeId ? (
//                               <>
//                                 <colgroup>
//                                   <col width="20%" />
//                                   <col width="12%" />
//                                   <col width="30%" />
//                                   <col width="19%" />
//                                   <col width="19%" />
//                                 </colgroup>
//                               </>
//                             ) : null}
//                             <colgroup>
//                               <col width="30%" />
//                               <col width="30%" />
//                               <col width="40%" />
//                             </colgroup>
//                             <Table.Header>
//                               <Table.Row>
//                                 <Table.HeaderCell textAlign="center">Company</Table.HeaderCell>
//                                 <Table.HeaderCell textAlign="center">이름</Table.HeaderCell>
//                                 <Table.HeaderCell textAlign="center">이메일</Table.HeaderCell>
//                                 {classroom &&
//                                 classroom.instructor &&
//                                 classroom.instructor &&
//                                 classroom.instructor.employeeId ? (
//                                   <>
//                                     <Table.HeaderCell textAlign="center">Lecture Hours</Table.HeaderCell>
//                                     <Table.HeaderCell textAlign="center">학습인정시간</Table.HeaderCell>
//                                   </>
//                                 ) : null}
//                               </Table.Row>
//                             </Table.Header>
//                             <Table.Body>
//                               <Table.Row>
//                                 <Table.Cell>
//                                   {(classroom.instructor.company && classroom.instructor.company) || '-'}
//                                 </Table.Cell>
//                                 <Table.Cell>
//                                   {(classroom.instructor.name && classroom.instructor.name) || '-'}
//                                 </Table.Cell>
//                                 <Table.Cell>
//                                   {(classroom.instructor.email && classroom.instructor.email) || '-'}
//                                 </Table.Cell>
//                                 {classroom &&
//                                 classroom.instructor &&
//                                 classroom.instructor &&
//                                 classroom.instructor.employeeId ? (
//                                   <>
//                                     <Table.Cell>
//                                       {(classroom.instructor.instructorLearningTime &&
//                                         classroom.instructor.instructorLearningTime) ||
//                                         '-'}{' '}
//                                       minute(s)
//                                     </Table.Cell>
//                                     <Table.Cell>
//                                       {(classroom.instructor.lectureTime && classroom.instructor.lectureTime) || '-'} minute(s)
//                                     </Table.Cell>
//                                   </>
//                                 ) : null}
//                               </Table.Row>
//                             </Table.Body>
//                           </Table>
//                         ) : (
//                           '-'
//                         )}
//                       </Table.Cell>
//                     </Table.Row>
//                     <Table.Row>
//                       <Table.Cell className="tb-header">POC Info</Table.Cell>
//                       <Table.Cell>
//                         {classroom.operation &&
//                         classroom.operation.operator &&
//                         classroom.operation.operator.employeeId ? (
//                           <Table celled>
//                             <colgroup>
//                               <col width="30%" />
//                               <col width="30%" />
//                               <col width="40%" />
//                             </colgroup>
//                             <Table.Header>
//                               <Table.Row>
//                                 <Table.HeaderCell textAlign="center">Company</Table.HeaderCell>
//                                 <Table.HeaderCell textAlign="center">이름</Table.HeaderCell>
//                                 <Table.HeaderCell textAlign="center">이메일</Table.HeaderCell>
//                               </Table.Row>
//                             </Table.Header>
//                             <Table.Body>
//                               <Table.Row>
//                                 <Table.Cell>{classroom.operation.getOperatorCompany}</Table.Cell>
//                                 <Table.Cell>{classroom.operation.getOperatorName}</Table.Cell>
//                                 <Table.Cell>{classroom.operation.getOperatorEmail}</Table.Cell>
//                               </Table.Row>
//                             </Table.Body>
//                           </Table>
//                         ) : (
//                           '-'
//                         )}
//                       </Table.Cell>
//                     </Table.Row>
//                   </Table.Body>
//                 </Table>
//               )) || ''}
//             </Table.Cell>
//           </Table.Row>
//         </Table.Body>
//       </Table>
//     );
//   }
// }
//
// export default ClassroomDetailView;
