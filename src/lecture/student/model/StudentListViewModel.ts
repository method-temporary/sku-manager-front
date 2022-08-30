import moment from 'moment';
import { DramaEntity } from '@nara.platform/accent/src/snap/index';
import { StudentXlsxModel } from './StudentXlsxModel';
import { StudentXlsxForTestModel } from './StudentXlsxForTestModel';
import EvaluationSheetModel from '../../../survey/answer/model/EvaluationSheetModel';
import { StudentModel } from './StudentModel';

export class StudentListViewModel extends StudentModel implements DramaEntity {
  answers: EvaluationSheetModel = new EvaluationSheetModel();
  surveyAnswered: string = 'N';

  constructor(student?: StudentListViewModel) {
    super(student);
    if (student) {
      const answers = (student.answers && student.answers) || new EvaluationSheetModel();
      const surveyAnswered = (student.surveyAnswered && student.surveyAnswered) || 'N';
      Object.assign(this, { ...student, answers, surveyAnswered });
    }
  }

  static asXLSX(student: StudentListViewModel): StudentXlsxModel {
    //
    return {
      소속사: student.company,
      '소속 조직(팀)': student.department,
      성명: student.name,
      'E-mail': student.email,
      신청시간: moment(student.creationTime).format('YYYY.MM.DD HH:mm:ss') || '-',
      상태: this.getStateName(student.proposalState),
      '상태 변경일': moment(student.updateTime).format('YYYY.MM.DD HH:mm:ss') || '-',
    };
  }

  static asXLSXForCourse(student: StudentListViewModel): StudentXlsxModel {
    //
    return {
      소속사: student.company,
      '소속 조직(팀)': student.department,
      성명: student.name,
      'E-mail': student.email,
      신청일: moment(student.creationTime).format('YYYY.MM.DD HH:mm:ss') || '-',
      '완료 Phase': student.completePhaseCount + '/' + student.phaseCount,
      'Stamp 획득 여부': this.getStampedName(student.stamped),
      'Course 이수 여부': this.getLearningStateName(student.learningState),
      'Course 이수일': moment(student.updateTimeForTest).format('YYYY.MM.DD HH:mm:ss') || '-',
    };
  }

  static asXLSXForTest(student: StudentListViewModel, examId: string, fileBoxId: string): StudentXlsxForTestModel {
    //
    return {
      소속사: student.company,
      '소속 조직(팀)': student.department,
      성명: student.name,
      'E-mail': student.email,
      시험성적: examId
        ? (student.studentScore &&
            student.studentScore.testScoreList.length > 0 &&
            String(student.studentScore.latestScore)) ||
          '미응시'
        : '-',
      응시횟수: examId
        ? (student.studentScore &&
            student.studentScore.numberOfTrials &&
            String(student.studentScore.numberOfTrials)) ||
          '0'
        : '-',
      과제점수: fileBoxId
        ? (student.studentScore && student.studentScore.homeworkScore && String(student.studentScore.homeworkScore)) ||
          '없음'
        : '-',
      '완료 Phase': `${student.completePhaseCount} / ${student.phaseCount}`,
      이수상태: this.getLearningStateName(student.learningState),
      '설문 결과': student.surveyAnswered,
      '상태 변경일': moment(student.updateTime).format('YYYY.MM.DD HH:mm:ss') || '-',
    };
  }
}
