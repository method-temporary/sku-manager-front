// import * as React from 'react';
// import { observer } from 'mobx-react';
// import { reactAutobind, ReactComponent } from '@nara.platform/accent';
// import { Button, Checkbox, Form, Icon, Table } from 'semantic-ui-react';
// import { LearningState } from '../../model/LearningState';
// import moment from 'moment';
// import { StudentModel } from '../../../../card/student/model/StudentModel';
//
// interface Props {
//   checkAll: (isChecked: string) => void;
//   checkOne: (index: number, name: string, value: boolean) => void;
//   onChangeStudentsTargetProps: (index: number, name: string, value: any) => void;
//   handleMarkExam: (examId: string, studentAudienceKey: string) => void;
//   reportModalShow: (student: StudentModel) => void;
//
//   selectedList: string[];
//   students: StudentModel[];
//   studentAll: string;
//   startNo: number;
//   examId: string;
//   fileBoxId: string;
//   reportName: string;
//   resultForModify: StudentModel[];
// }
//
// @observer
// @reactAutobind
// class ResultManagementListView extends ReactComponent<Props, {}> {
//   //
//   render() {
//     //
//     const { checkAll, checkOne, onChangeStudentsTargetProps, handleMarkExam, reportModalShow } = this.props;
//     const { selectedList, students, studentAll, startNo, examId, fileBoxId, reportName, resultForModify } = this.props;
//
//     const allSelected = students.filter((student) => !student.selected).length === 0;
//
//     return (
//       <Table celled>
//         <colgroup>
//           <col width="3%" />
//           <col width="4%" />
//           <col width="7%" />
//           <col width="10%" />
//           <col width="6%" />
//           <col width="7%" />
//           <col width="6%" />
//           <col width="7%" />
//           <col width="8%" />
//           <col width="9%" />
//           <col width="9%" />
//           <col width="9%" />
//           <col width="9%" />
//           <col width="10%" />
//         </colgroup>
//
//         <Table.Header>
//           <Table.Row>
//             <Table.HeaderCell textAlign="center">
//               <Form.Field
//                 control={Checkbox}
//                 checked={allSelected}
//                 onChange={(e: any, data: any) => checkAll(data.value)}
//               />
//             </Table.HeaderCell>
//             <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
//             <Table.HeaderCell textAlign="center">Company</Table.HeaderCell>
//             <Table.HeaderCell textAlign="center">Organization (Team)</Table.HeaderCell>
//             <Table.HeaderCell textAlign="center">Name</Table.HeaderCell>
//             <Table.HeaderCell textAlign="center">E-mail</Table.HeaderCell>
//             <Table.HeaderCell textAlign="center">시험성적</Table.HeaderCell>
//             <Table.HeaderCell textAlign="center">응시횟수</Table.HeaderCell>
//             <Table.HeaderCell textAlign="center">Test Confirmation</Table.HeaderCell>
//             <Table.HeaderCell textAlign="center">Assignment Scores</Table.HeaderCell>
//             <Table.HeaderCell textAlign="center">Assignment Confirmation</Table.HeaderCell>
//             <Table.HeaderCell textAlign="center">완료여부</Table.HeaderCell>
//             <Table.HeaderCell textAlign="center">Survey Results</Table.HeaderCell>
//             <Table.HeaderCell textAlign="center">Status Change Date</Table.HeaderCell>
//           </Table.Row>
//         </Table.Header>
//
//         <Table.Body>
//           {(students &&
//             students.length &&
//             students.map((student, index) => (
//               <Table.Row key={index}>
//                 <Table.Cell textAlign="center">
//                   <Form.Field
//                     control={Checkbox}
//                     value={student}
//                     checked={selectedList.includes(student.id)}
//                     onChange={(e: any, data: any) => checkOne(index, 'selected', data.checked)}
//                   />
//                 </Table.Cell>
//                 <Table.Cell textAlign="center">{startNo - index}</Table.Cell>
//                 <Table.Cell textAlign="center">{student.company}</Table.Cell>
//                 <Table.Cell textAlign="center">{student.department}</Table.Cell>
//                 <Table.Cell textAlign="center">{student.name}</Table.Cell>
//                 <Table.Cell textAlign="center">{student.email}</Table.Cell>
//                 {examId !== null &&
//                   examId !== '' &&
//                   examId !== 'undefined' &&
//                   ((fileBoxId !== null && fileBoxId !== '' && fileBoxId !== 'undefined') ||
//                     (reportName !== null && reportName !== '' && reportName !== 'undefined')) && (
//                     <>
//                       {(student.studentScore &&
//                         student.studentScore.numberOfTrials > 0 &&
//                         student.learningState === LearningState.Passed && (
//                           <Table.Cell textAlign="center">{student.studentScore.latestScore}</Table.Cell>
//                         )) ||
//                         (student.studentScore &&
//                           student.studentScore.numberOfTrials > 0 &&
//                           student.learningState === LearningState.Missed && (
//                             <Table.Cell textAlign="center">{student.studentScore.latestScore}</Table.Cell>
//                           )) ||
//                         (student.studentScore &&
//                           student.studentScore.numberOfTrials > 0 &&
//                           student.learningState === LearningState.Failed && (
//                             <Table.Cell textAlign="center">{student.studentScore.latestScore}</Table.Cell>
//                           )) ||
//                         (student.studentScore &&
//                           student.studentScore.numberOfTrials > 0 &&
//                           student.learningState === LearningState.NoShow && (
//                             <Table.Cell textAlign="center">{student.studentScore.latestScore}</Table.Cell>
//                           )) ||
//                         (student.studentScore &&
//                           student.studentScore.numberOfTrials > 0 &&
//                           (student.learningState === LearningState.HomeworkWaiting ||
//                             student.learningState === LearningState.TestPassed) && (
//                             <Table.Cell textAlign="center">{student.studentScore.latestScore}</Table.Cell>
//                           )) ||
//                         (student.studentScore &&
//                           student.studentScore.numberOfTrials > 0 &&
//                           student.learningState === LearningState.Progress && (
//                             <Table.Cell textAlign="center">{student.studentScore.latestScore}</Table.Cell>
//                           )) ||
//                         (student.examAttendance &&
//                           !student.studentScore.submittedEssay &&
//                           student.learningState === LearningState.Failed && (
//                             <Table.Cell textAlign="center">{student.studentScore.latestScore}</Table.Cell>
//                           )) ||
//                         (student.examAttendance && student.studentScore.submittedEssay && (
//                           <Table.Cell textAlign="center">
//                             <input
//                               type="number"
//                               min="0"
//                               max="100"
//                               onChange={(e) =>
//                                 onChangeStudentsTargetProps(index, 'studentScore.latestScore', e.target.value)
//                               }
//                             />
//                           </Table.Cell>
//                         )) || <Table.Cell></Table.Cell>}
//                       {(student.studentScore && student.studentScore.numberOfTrials > 0 && (
//                         <Table.Cell textAlign="center">{student.studentScore.numberOfTrials}</Table.Cell>
//                       )) || <Table.Cell textAlign="center">0</Table.Cell>}
//                       {(student.studentScore &&
//                         student.studentScore.testScoreList.length > 0 &&
//                         student.learningState === LearningState.Passed && (
//                           <Table.Cell textAlign="center">
//                             <Button
//                               onClick={() => handleMarkExam(student.studentScore.examId, student.patronKey.keyString)}
//                             >
//                               View Results
//                             </Button>
//                           </Table.Cell>
//                         )) ||
//                         (student.studentScore &&
//                           student.studentScore.testScoreList.length > 0 &&
//                           student.learningState === LearningState.Missed && (
//                             <Table.Cell textAlign="center">
//                               <Button
//                                 onClick={() => handleMarkExam(student.studentScore.examId, student.patronKey.keyString)}
//                               >
//                                 View Results
//                               </Button>
//                             </Table.Cell>
//                           )) ||
//                         (student.studentScore &&
//                           student.studentScore.testScoreList.length > 0 &&
//                           (student.learningState === LearningState.HomeworkWaiting ||
//                             student.learningState === LearningState.TestPassed) && (
//                             <Table.Cell textAlign="center">
//                               <Button
//                                 onClick={() => handleMarkExam(student.studentScore.examId, student.patronKey.keyString)}
//                               >
//                                 View Results
//                               </Button>
//                             </Table.Cell>
//                           )) ||
//                         (student.studentScore &&
//                           student.studentScore.testScoreList.length > 0 &&
//                           student.learningState === LearningState.Progress && (
//                             <Table.Cell textAlign="center">
//                               <Button
//                                 onClick={() => handleMarkExam(student.studentScore.examId, student.patronKey.keyString)}
//                               >
//                                 View Results
//                               </Button>
//                             </Table.Cell>
//                           )) ||
//                         (student.examAttendance && student.learningState === LearningState.TestWaiting && (
//                           <Table.Cell textAlign="center">
//                             <Button
//                               onClick={() => handleMarkExam(student.studentScore.examId, student.patronKey.keyString)}
//                             >
//                               Grade
//                             </Button>
//                           </Table.Cell>
//                         )) ||
//                         (student.examAttendance && student.learningState === LearningState.Failed && (
//                           <Table.Cell textAlign="center">
//                             <Button
//                               onClick={() => handleMarkExam(student.studentScore.examId, student.patronKey.keyString)}
//                             >
//                               Grade
//                             </Button>
//                           </Table.Cell>
//                         )) || <Table.Cell textAlign="center">미응시</Table.Cell>}
//                       {(student.learningState === LearningState.Passed && (
//                         <Table.Cell textAlign="center">{student.studentScore.homeworkScore}</Table.Cell>
//                       )) ||
//                         (student.learningState === LearningState.Missed && (
//                           <Table.Cell textAlign="center">{student.studentScore.homeworkScore}</Table.Cell>
//                         )) ||
//                         (student.learningState === LearningState.NoShow && (
//                           <Table.Cell textAlign="center">{student.studentScore.homeworkScore}</Table.Cell>
//                         )) ||
//                         (!student.homeworkFileBoxId && !student.homeworkContent && (
//                           <Table.Cell textAlign="center">{student.studentScore.homeworkScore}</Table.Cell>
//                         )) || (
//                           <Table.Cell textAlign="center">
//                             <input
//                               type="number"
//                               min="0"
//                               max="100"
//                               value={resultForModify[index].studentScore.homeworkScore}
//                               onChange={(e) =>
//                                 onChangeStudentsTargetProps(index, 'studentScore.homeworkScore', e.target.value)
//                               }
//                             />
//                           </Table.Cell>
//                         )}
//                       {(!student.homeworkFileBoxId && !student.homeworkContent && (
//                         <Table.Cell textAlign="center">미제출</Table.Cell>
//                       )) ||
//                         (student.studentScore && student.studentScore.homeworkScore > 0 && (
//                           <Table.Cell textAlign="center">
//                             <Button
//                               onClick={
//                                 () => reportModalShow(student)
//
//                                 /*
//                             depot.downloadDepot(student.homeworkFileBoxId) */
//                               }
//                             >
//                               View Results
//                             </Button>
//                           </Table.Cell>
//                         )) || (
//                           <Table.Cell textAlign="center">
//                             <Button
//                               onClick={
//                                 () => reportModalShow(student)
//                                 /* depot.downloadDepot(student.homeworkFileBoxId) */
//                               }
//                             >
//                               Grade
//                             </Button>
//                           </Table.Cell>
//                         )}
//                       {(student.learningState === LearningState.Progress && (
//                         <Table.Cell textAlign="center">Hold Results</Table.Cell>
//                       )) ||
//                         (student.learningState === LearningState.Waiting && (
//                           <Table.Cell textAlign="center">Hold Results</Table.Cell>
//                         )) ||
//                         (student.learningState === LearningState.Failed && (
//                           <Table.Cell textAlign="center">Hold Results</Table.Cell>
//                         )) ||
//                         (student.learningState === LearningState.TestWaiting && (
//                           <Table.Cell textAlign="center">Hold Results</Table.Cell>
//                         )) ||
//                         (student.learningState === LearningState.HomeworkWaiting && (
//                           <Table.Cell textAlign="center">Hold Results</Table.Cell>
//                         )) ||
//                         (student.learningState === LearningState.TestPassed && (
//                           <Table.Cell textAlign="center">Hold Results</Table.Cell>
//                         )) ||
//                         (student.learningState === LearningState.Passed && (
//                           <Table.Cell textAlign="center">이수</Table.Cell>
//                         )) ||
//                         (student.learningState === LearningState.Missed && (
//                           <Table.Cell textAlign="center">미이수</Table.Cell>
//                         )) ||
//                         (student.learningState === LearningState.NoShow && (
//                           <Table.Cell textAlign="center">No Show</Table.Cell>
//                         )) || <Table.Cell textAlign="center" />}
//                       <Table.Cell textAlign="center">{student.surveyAnswered}</Table.Cell>
//                       {student.updateTimeForTest ? (
//                         <Table.Cell textAlign="center">
//                           {moment(student.updateTimeForTest).format('YYYY.MM.DD HH:mm:ss') || '-'}
//                         </Table.Cell>
//                       ) : (
//                         <Table.Cell></Table.Cell>
//                       )}
//                     </>
//                   )}
//                 {examId !== null &&
//                   examId !== '' &&
//                   examId !== 'undefined' &&
//                   (fileBoxId === null || fileBoxId === '' || fileBoxId === 'undefined') &&
//                   (reportName === null || reportName === '' || reportName === 'undefined') && (
//                     <>
//                       {(student.studentScore &&
//                         student.studentScore.numberOfTrials > 0 &&
//                         student.learningState === LearningState.Passed && (
//                           <Table.Cell textAlign="center">{student.studentScore.latestScore}</Table.Cell>
//                         )) ||
//                         (student.studentScore &&
//                           student.studentScore.numberOfTrials > 0 &&
//                           student.learningState === LearningState.Missed && (
//                             <Table.Cell textAlign="center">{student.studentScore.latestScore}</Table.Cell>
//                           )) ||
//                         (student.studentScore &&
//                           student.studentScore.numberOfTrials > 0 &&
//                           student.learningState === LearningState.NoShow && (
//                             <Table.Cell textAlign="center">{student.studentScore.latestScore}</Table.Cell>
//                           )) ||
//                         (student.studentScore &&
//                           student.studentScore.numberOfTrials > 0 &&
//                           (student.learningState === LearningState.HomeworkWaiting ||
//                             student.learningState === LearningState.TestPassed) && (
//                             <Table.Cell textAlign="center">{student.studentScore.latestScore}</Table.Cell>
//                           )) ||
//                         (student.studentScore &&
//                           student.studentScore.numberOfTrials > 0 &&
//                           student.learningState === LearningState.Progress && (
//                             <Table.Cell textAlign="center">{student.studentScore.latestScore}</Table.Cell>
//                           )) ||
//                         (student.examAttendance &&
//                           student.studentScore.submittedEssay &&
//                           student.learningState === LearningState.TestWaiting && (
//                             <Table.Cell textAlign="center">
//                               <input
//                                 type="number"
//                                 min="0"
//                                 max="100"
//                                 onChange={(e) =>
//                                   onChangeStudentsTargetProps(index, 'studentScore.latestScore', e.target.value)
//                                 }
//                               />
//                             </Table.Cell>
//                           )) ||
//                         (student.examAttendance && student.learningState === LearningState.Failed && (
//                           <Table.Cell textAlign="center">{student.studentScore.latestScore}</Table.Cell>
//                         )) || <Table.Cell></Table.Cell>}
//                       {(student.studentScore && student.studentScore.numberOfTrials > 0 && (
//                         <Table.Cell textAlign="center">{student.studentScore.numberOfTrials}</Table.Cell>
//                       )) || <Table.Cell textAlign="center">0</Table.Cell>}
//                       {(student.studentScore &&
//                         student.studentScore.numberOfTrials > 0 &&
//                         student.learningState === LearningState.Passed && (
//                           <Table.Cell textAlign="center">
//                             <Button
//                               onClick={() => handleMarkExam(student.studentScore.examId, student.patronKey.keyString)}
//                             >
//                               View Results
//                             </Button>
//                           </Table.Cell>
//                         )) ||
//                         (student.studentScore &&
//                           student.studentScore.numberOfTrials > 0 &&
//                           student.learningState === LearningState.Missed && (
//                             <Table.Cell textAlign="center">
//                               <Button
//                                 onClick={() => handleMarkExam(student.studentScore.examId, student.patronKey.keyString)}
//                               >
//                                 View Results
//                               </Button>
//                             </Table.Cell>
//                           )) ||
//                         (student.studentScore &&
//                           student.studentScore.numberOfTrials > 0 &&
//                           (student.learningState === LearningState.HomeworkWaiting ||
//                             student.learningState === LearningState.TestPassed) && (
//                             <Table.Cell textAlign="center">
//                               <Button
//                                 onClick={() => handleMarkExam(student.studentScore.examId, student.patronKey.keyString)}
//                               >
//                                 View Results
//                               </Button>
//                             </Table.Cell>
//                           )) ||
//                         (student.studentScore &&
//                           student.studentScore.numberOfTrials > 0 &&
//                           student.learningState === LearningState.Progress && (
//                             <Table.Cell textAlign="center">
//                               <Button
//                                 onClick={() => handleMarkExam(student.studentScore.examId, student.patronKey.keyString)}
//                               >
//                                 View Results
//                               </Button>
//                             </Table.Cell>
//                           )) ||
//                         (student.examAttendance && student.learningState === LearningState.TestWaiting && (
//                           <Table.Cell textAlign="center">
//                             <Button
//                               onClick={() => handleMarkExam(student.studentScore.examId, student.patronKey.keyString)}
//                             >
//                               Grade
//                             </Button>
//                           </Table.Cell>
//                         )) ||
//                         (student.examAttendance && student.learningState === LearningState.Waiting && (
//                           <Table.Cell textAlign="center">
//                             <Button
//                               onClick={() => handleMarkExam(student.studentScore.examId, student.patronKey.keyString)}
//                             >
//                               View Results
//                             </Button>
//                           </Table.Cell>
//                         )) ||
//                         (student.examAttendance && student.learningState === LearningState.Failed && (
//                           <Table.Cell textAlign="center">
//                             <Button
//                               onClick={() => handleMarkExam(student.studentScore.examId, student.patronKey.keyString)}
//                             >
//                               View Results
//                             </Button>
//                           </Table.Cell>
//                         )) || <Table.Cell textAlign="center">미응시</Table.Cell>}
//                       <Table.Cell textAlign="center">-</Table.Cell>
//                       <Table.Cell textAlign="center">-</Table.Cell>
//                       {(student.learningState === LearningState.Progress && (
//                         <Table.Cell textAlign="center">Hold Results</Table.Cell>
//                       )) ||
//                         (student.learningState === LearningState.Waiting && (
//                           <Table.Cell textAlign="center">Hold Results</Table.Cell>
//                         )) ||
//                         (student.learningState === LearningState.TestPassed && (
//                           <Table.Cell textAlign="center">Hold Results</Table.Cell>
//                         )) ||
//                         (student.learningState === LearningState.Failed && (
//                           <Table.Cell textAlign="center">Hold Results</Table.Cell>
//                         )) ||
//                         (student.learningState === LearningState.TestWaiting && (
//                           <Table.Cell textAlign="center">Hold Results</Table.Cell>
//                         )) ||
//                         (student.learningState === LearningState.HomeworkWaiting && (
//                           <Table.Cell textAlign="center">Hold Results</Table.Cell>
//                         )) ||
//                         (student.learningState === LearningState.Passed && (
//                           <Table.Cell textAlign="center">이수</Table.Cell>
//                         )) ||
//                         (student.learningState === LearningState.Missed && (
//                           <Table.Cell textAlign="center">미이수</Table.Cell>
//                         )) ||
//                         (student.learningState === LearningState.NoShow && (
//                           <Table.Cell textAlign="center">No Show</Table.Cell>
//                         )) || <Table.Cell textAlign="center" />}
//                       <Table.Cell textAlign="center">{student.surveyAnswered}</Table.Cell>
//                       {student.updateTimeForTest ? (
//                         <Table.Cell textAlign="center">
//                           {moment(student.updateTimeForTest).format('YYYY.MM.DD HH:mm:ss') || '-'}
//                         </Table.Cell>
//                       ) : (
//                         <Table.Cell></Table.Cell>
//                       )}
//                     </>
//                   )}
//                 {(examId === null || examId === '' || examId === 'undefined') &&
//                   ((fileBoxId !== null && fileBoxId !== '' && fileBoxId !== 'undefined') ||
//                     (reportName !== null && reportName !== '' && reportName !== 'undefined')) && (
//                     <>
//                       <Table.Cell textAlign="center">-</Table.Cell>
//                       <Table.Cell textAlign="center">-</Table.Cell>
//                       <Table.Cell textAlign="center">-</Table.Cell>
//                       {(student.learningState === LearningState.Passed && (
//                         <Table.Cell textAlign="center">{student.studentScore.homeworkScore}</Table.Cell>
//                       )) ||
//                         (student.learningState === LearningState.Missed && (
//                           <Table.Cell textAlign="center">{student.studentScore.homeworkScore}</Table.Cell>
//                         )) ||
//                         (student.learningState === LearningState.NoShow && (
//                           <Table.Cell textAlign="center">{student.studentScore.homeworkScore}</Table.Cell>
//                         )) ||
//                         (!student.homeworkFileBoxId && !student.homeworkContent && (
//                           <Table.Cell textAlign="center">{student.studentScore.homeworkScore}</Table.Cell>
//                         )) || (
//                           <Table.Cell textAlign="center">
//                             <input
//                               type="number"
//                               min="0"
//                               max="100"
//                               value={resultForModify[index].studentScore.homeworkScore}
//                               onChange={(e) =>
//                                 onChangeStudentsTargetProps(index, 'studentScore.homeworkScore', e.target.value)
//                               }
//                             />
//                           </Table.Cell>
//                         )}
//                       {(!student.homeworkFileBoxId && !student.homeworkContent && (
//                         <Table.Cell textAlign="center">미제출</Table.Cell>
//                       )) ||
//                         (student.studentScore && student.studentScore.homeworkScore > 0 && (
//                           <Table.Cell textAlign="center">
//                             <Button
//                               onClick={
//                                 () => reportModalShow(student)
//                                 /* depot.downloadDepot(student.homeworkFileBoxId) */
//                               }
//                             >
//                               View Results
//                             </Button>
//                           </Table.Cell>
//                         )) || (
//                           <Table.Cell textAlign="center">
//                             <Button
//                               onClick={
//                                 () => reportModalShow(student)
//                                 /* depot.downloadDepot(student.homeworkFileBoxId)*/
//                               }
//                             >
//                               Grade
//                             </Button>
//                           </Table.Cell>
//                         )}
//                       {(student.learningState === LearningState.Progress && (
//                         <Table.Cell textAlign="center">Hold Results</Table.Cell>
//                       )) ||
//                         (student.learningState === LearningState.Waiting && (
//                           <Table.Cell textAlign="center">Hold Results</Table.Cell>
//                         )) ||
//                         (student.learningState === LearningState.Failed && (
//                           <Table.Cell textAlign="center">Hold Results</Table.Cell>
//                         )) ||
//                         (student.learningState === LearningState.TestWaiting && (
//                           <Table.Cell textAlign="center">Hold Results</Table.Cell>
//                         )) ||
//                         (student.learningState === LearningState.HomeworkWaiting && (
//                           <Table.Cell textAlign="center">Hold Results</Table.Cell>
//                         )) ||
//                         (student.learningState === LearningState.TestPassed && (
//                           <Table.Cell textAlign="center">Hold Results</Table.Cell>
//                         )) ||
//                         (student.learningState === LearningState.Passed && (
//                           <Table.Cell textAlign="center">이수</Table.Cell>
//                         )) ||
//                         (student.learningState === LearningState.Missed && (
//                           <Table.Cell textAlign="center">미이수</Table.Cell>
//                         )) ||
//                         (student.learningState === LearningState.NoShow && (
//                           <Table.Cell textAlign="center">No Show</Table.Cell>
//                         )) || <Table.Cell textAlign="center" />}
//                       <Table.Cell textAlign="center">{student.surveyAnswered}</Table.Cell>
//                       {student.updateTimeForTest ? (
//                         <Table.Cell textAlign="center">
//                           {moment(student.updateTimeForTest).format('YYYY.MM.DD HH:mm:ss') || '-'}
//                         </Table.Cell>
//                       ) : (
//                         <Table.Cell></Table.Cell>
//                       )}
//                     </>
//                   )}
//                 {(examId === null || examId === '' || examId === 'undefined') &&
//                   (fileBoxId === null || fileBoxId === '' || fileBoxId === 'undefined') &&
//                   (reportName === null || reportName === '' || reportName === 'undefined') && (
//                     <>
//                       <Table.Cell textAlign="center">-</Table.Cell>
//                       <Table.Cell textAlign="center">-</Table.Cell>
//                       <Table.Cell textAlign="center">-</Table.Cell>
//                       <Table.Cell textAlign="center">-</Table.Cell>
//                       <Table.Cell textAlign="center">-</Table.Cell>
//                       {(student.learningState === LearningState.Progress && (
//                         <Table.Cell textAlign="center">Hold Results</Table.Cell>
//                       )) ||
//                         (student.learningState === LearningState.Waiting && (
//                           <Table.Cell textAlign="center">Hold Results</Table.Cell>
//                         )) ||
//                         (student.learningState === LearningState.TestPassed && (
//                           <Table.Cell textAlign="center">Hold Results</Table.Cell>
//                         )) ||
//                         (student.learningState === LearningState.Failed && (
//                           <Table.Cell textAlign="center">Hold Results</Table.Cell>
//                         )) ||
//                         (student.learningState === LearningState.Passed && (
//                           <Table.Cell textAlign="center">이수</Table.Cell>
//                         )) ||
//                         (student.learningState === LearningState.Missed && (
//                           <Table.Cell textAlign="center">미이수</Table.Cell>
//                         )) ||
//                         (student.learningState === LearningState.NoShow && (
//                           <Table.Cell textAlign="center">No Show</Table.Cell>
//                         )) || <Table.Cell textAlign="center" />}
//                       <Table.Cell textAlign="center">{student.surveyAnswered}</Table.Cell>
//                       {student.updateTimeForTest ? (
//                         <Table.Cell textAlign="center">
//                           {moment(student.updateTimeForTest).format('YYYY.MM.DD HH:mm:ss') || '-'}
//                         </Table.Cell>
//                       ) : (
//                         <Table.Cell></Table.Cell>
//                       )}
//                     </>
//                   )}
//               </Table.Row>
//             ))) || (
//             <Table.Row>
//               <Table.Cell textAlign="center" colSpan={12}>
//                 <div className="no-cont-wrap no-contents-icon">
//                   <Icon className="no-contents80" />
//                   <div className="sr-only">콘텐츠 없음</div>
//                   <div className="text">검색 결과를 찾을 수 없습니다.</div>
//                 </div>
//               </Table.Cell>
//             </Table.Row>
//           )}
//         </Table.Body>
//       </Table>
//     );
//   }
// }
//
// export default ResultManagementListView;
