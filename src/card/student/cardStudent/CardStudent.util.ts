import { StudentWithUserIdentity } from '../../../_data/lecture/students/model/sdo/StudentWithUserIdentity';
import { LearningState } from '_data/shared/LearningState';
import { StudentXlsxModel } from '../../../student/model/StudentXlsxModel';
import dayjs from 'dayjs';
import { ProposalState } from '_data/shared/ProposalState';

export const parseStudentExcelModel = (students: StudentWithUserIdentity[]): StudentXlsxModel[] => {
  //
  return students.map(({ student, userIdentity }) => {
    const excelModel = {
      '소속사(Ko)': (userIdentity && userIdentity.companyName.ko) || '-',
      '소속사(En)': (userIdentity && userIdentity.companyName.en) || '-',
      '소속사(Zh)': (userIdentity && userIdentity.companyName.zh) || '-',
      '소속 조직(팀) (Ko)': (userIdentity && userIdentity.departmentName.ko) || '-',
      '소속 조직(팀) (En)': (userIdentity && userIdentity.departmentName.en) || '-',
      '소속 조직(팀) (Zh)': (userIdentity && userIdentity.departmentName.zh) || '-',
      성명: student.name || '-',
      'E-mail': (userIdentity && userIdentity.email) || '',
      /*신청일: new Date(student.creationTime).toISOString().substr(0, 10) + ' ' + new Date(student.creationTime).toLocaleTimeString('en-GB'),*/
      신청일: dayjs(student.registeredTime).format('YYYY.MM.DD HH:mm:ss') || '-',
      '완료 Phase': student.completePhaseCount + '/' + student.phaseCount,
      // 'Stamp 획득 여부': this.getStampedName(student.stamped),
      'Card 이수 여부': getLearningStateName(student.learningState),
      차수: student.round ? student.round.toString() : undefined,
      'Card 이수일':
        student.modifiedTime === 0 || !student.modifiedTime
          ? '-'
          : getLearningStateName(student.learningState) === '이수'
          ? dayjs(student.modifiedTime).format('YYYY.MM.DD HH:mm:ss')
          : '-',
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

export const getProposalStateName = (proposalState: ProposalState, learningState?: LearningState) => {
  //
  if (proposalState && proposalState === 'Approved') {
    return '승인' + (learningState === 'Progress' ? '(학습중)' : '');
  }
  if (proposalState && proposalState === 'Submitted') {
    return '승인대기';
  }
  if (proposalState && proposalState === 'Canceled') {
    return '취소';
  }
  if (proposalState && proposalState === 'Rejected') {
    return '반려';
  }
  return '';
};
