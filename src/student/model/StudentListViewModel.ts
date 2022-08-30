// import moment from 'moment';
// import { DramaEntity } from '@nara.platform/accent/src/snap/index';
// import { StudentXlsxModel } from './StudentXlsxModel';
// import { StudentXlsxForTestModel } from './StudentXlsxForTestModel';
// import EvaluationSheetModel from '../../survey/answer/model/EvaluationSheetModel';
// import { StudentModel } from './StudentModel';
//
// export class StudentListViewModel extends StudentModel implements DramaEntity {
//   answers: EvaluationSheetModel = new EvaluationSheetModel();
//   surveyAnswered: string = 'N';
//
//   constructor(student?: StudentListViewModel) {
//     super(student);
//     if (student) {
//       const answers = (student.answers && student.answers) || new EvaluationSheetModel();
//       const surveyAnswered = (student.surveyAnswered && student.surveyAnswered) || 'N';
//       Object.assign(this, { ...student, answers, surveyAnswered });
//     }
//   }
//
//   static asXLSX(student: StudentListViewModel): StudentXlsxModel {
//     //
//     return {
//       Company: student.company,
//       'Organization (Team)': student.department,
//       Name: student.name,
//       'E-mail': student.email,
//       /*Time of Application: new Date(student.creationTime).toISOString().substr(0, 10) + ' ' + new Date(student.creationTime).toLocaleTimeString('en-GB'),*/
//       Time of Application: moment(student.creationTime).format('YYYY.MM.DD HH:mm:ss') || '-',
//       상태: this.getStateName(student.proposalState),
//       /*Status Change Date: new Date(student.updateTime).toISOString().substr(0, 10) + ' ' + new Date(student.updateTime).toLocaleTimeString('en-GB'),*/
//       'Status Change Date': moment(student.updateTime).format('YYYY.MM.DD HH:mm:ss') || '-',
//     };
//   }
//
//   static asXLSXForCourse(student: StudentListViewModel): StudentXlsxModel {
//     //
//     return {
//       Company: student.company,
//       'Organization (Team)': student.department,
//       Name: student.name,
//       'E-mail': student.email,
//       /*신청일: new Date(student.creationTime).toISOString().substr(0, 10) + ' ' + new Date(student.creationTime).toLocaleTimeString('en-GB'),*/
//       신청일: moment(student.creationTime).format('YYYY.MM.DD HH:mm:ss') || '-',
//       'Complete Phase': student.completePhaseCount + '/' + student.phaseCount,
//       'Stamps Acquired (Y/N)': this.getStampedName(student.stamped),
//       'Card Completion Status': this.getLearningStateName(student.learningState),
//       /*Course이수일: student.updateTimeForTest === 0 ? '-' : new Date(student.updateTimeForTest).toISOString().substr(0, 10) + ' ' + new Date(student.updateTimeForTest).toLocaleTimeString('en-GB'),*/
//       'Card 이수일': moment(student.updateTimeForTest).format('YYYY.MM.DD HH:mm:ss') || '-',
//     };
//   }
//
//   static asXLSXForTest(student: StudentListViewModel, examId: string, fileBoxId: string): StudentXlsxForTestModel {
//     //
//     return {
//       Company: student.company,
//       'Organization (Team)': student.department,
//       Name: student.name,
//       'E-mail': student.email,
//       시험성적: examId
//         ? (student.studentScore &&
//         student.studentScore.testScoreList.length > 0 &&
//         String(student.studentScore.latestScore)) ||
//         '미응시'
//         : '-',
//       응시횟수: examId
//         ? (student.studentScore &&
//         student.studentScore.numberOfTrials &&
//         String(student.studentScore.numberOfTrials)) ||
//         '0'
//         : '-',
//       Assignment Scores: fileBoxId
//         ? (student.studentScore && student.studentScore.homeworkScore && String(student.studentScore.homeworkScore)) ||
//         '없음'
//         : '-',
//       'Complete Phase': `${student.completePhaseCount} / ${student.phaseCount}`,
//       이수상태: this.getLearningStateName(student.learningState),
//       /*"Status Change Date": new Date(student.updateTime).toISOString().substr(0, 10) + ' ' + new Date(student.updateTime).toLocaleTimeString('en-GB'),*/
//       'Survey Results': student.surveyAnswered,
//       'Status Change Date': moment(student.updateTime).format('YYYY.MM.DD HH:mm:ss') || '-',
//     };
//   }
// }
