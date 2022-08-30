import { StudentWithUserIdentity } from '../../../_data/lecture/students/model/sdo/StudentWithUserIdentity';
import { StudentXlsxModel } from '../../../student/model/StudentXlsxModel';
import { ExtraWorkState } from '../../../student/model/vo/ExtraWorkState';
import { LearningState } from '_data/shared/LearningState';
import dayjs from 'dayjs';
import { PolyglotModel } from '../../../shared/model';

export const parseStudentResultExcelModel = (
  students: StudentWithUserIdentity[],
  paperId?: string,
  reportName?: PolyglotModel,
  fileBoxId?: string,
  surveyId?: string
): StudentXlsxModel[] => {
  //
  return students.map(({ student, userIdentity }) => {
    let reportScore = '-';
    let surveyState = '-';

    if (student.extraWork.reportStatus) {
      if (
        student.extraWork.reportStatus === ExtraWorkState.Pass ||
        student.extraWork.reportStatus === ExtraWorkState.Fail
      ) {
        reportScore = String(student.studentScore.homeworkScore);
      } else if (student.extraWork.reportStatus === ExtraWorkState.Submit) {
        reportScore = '채점중';
      }
    } else if (reportName || fileBoxId) {
      reportScore = '미제출';
    }

    if (surveyId) {
      if (
        student.extraWork.surveyStatus !== null &&
        (student.extraWork.surveyStatus === ExtraWorkState.Submit ||
          student.extraWork.surveyStatus === ExtraWorkState.Pass)
      ) {
        surveyState = 'Y';
      } else {
        surveyState = 'N';
      }
    }

    const excelModel = {
      '소속사(Ko)': (userIdentity && userIdentity.companyName.ko) || '-',
      '소속사(En)': (userIdentity && userIdentity.companyName.en) || '-',
      '소속사(Zh)': (userIdentity && userIdentity.companyName.zh) || '-',
      '소속 조직(팀) (Ko)': (userIdentity && userIdentity.departmentName.ko) || '-',
      '소속 조직(팀) (En)': (userIdentity && userIdentity.departmentName.en) || '-',
      '소속 조직(팀) (Zh)': (userIdentity && userIdentity.departmentName.zh) || '-',
      성명: student.name || '-',
      'E-mail': (userIdentity && userIdentity.email) || '-',
      시험성적: paperId
        ? (student.studentScore &&
            student.studentScore.testScoreList &&
            student.studentScore.testScoreList.length > 0 &&
            String(student.studentScore.latestScore)) ||
          '미응시'
        : '-',
      응시횟수: paperId
        ? (student.studentScore &&
            student.studentScore.numberOfTrials &&
            String(student.studentScore.numberOfTrials)) ||
          '0'
        : '-',
      과제점수: reportScore,
      '완료 Phase': `${student.completePhaseCount} / ${student.phaseCount}`,
      이수상태: getLearningStateName(student.learningState),
      차수: student.round ? student.round.toString() : undefined,
      설문결과: surveyState,
      /*"Status Change Date": new Date(student.updateTime).toISOString().substr(0, 10) + ' ' + new Date(student.updateTime).toLocaleTimeString('en-GB'),*/
      '상태 변경일': dayjs(student.modifiedTime).format('YYYY.MM.DD HH:mm:ss') || '-',
      재직여부: userIdentity && userIdentity.id && userIdentity.id !== '' ? 'Y' : 'N',
    };
    if (student.round === 0) {
      delete excelModel['차수'];
    }

    return excelModel;
  });
};

export const getLearningStateName = (learningState: LearningState) => {
  //
  if (learningState && learningState === 'Progress') {
    return '결과처리 대기';
  }
  // if (learningState && learningState === 'Waiting') {
  //   return '결과처리 대기';
  // }
  if (learningState && learningState === 'Passed') {
    return '이수';
  }
  if (learningState && learningState === 'Missed') {
    return '미이수';
  }
  if (learningState && learningState === 'NoShow') {
    return '불참';
  }
  return '';
};
