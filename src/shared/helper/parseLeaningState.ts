import { LearningStateType } from 'lecture/student/model/LearningState';

/**
 *
 * @param learningState 이수 상태를 나타내는 값
 * @returns 영어로 되어있는 이수 상태 값을 한글로 변환해준다.
 */
export function parseLearningState(learningState?: LearningStateType) {
  switch (learningState) {
    case 'Progress':
      return '결과처리 대기자';
    case 'Missed':
      return '미이수자';
    case 'NoShow':
      return '불참자';
    case 'Passed':
      return '이수자';
    default:
      return '전체';
  }
}
