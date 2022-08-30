import { LearningState as LearningStateEnum } from '../../student/model/vo/LearningState';

export type LearningState = 'Progress' | 'Passed' | 'Missed' | 'NoShow' | '';

export function displayLearningState(state: LearningState) {
  //
  if (state === 'Progress') {
    return '결과처리대기';
  }

  if (state === 'Passed') {
    return '이수';
  }

  if (state === 'Missed') {
    return '미이수';
  }

  if (state === 'NoShow') {
    return '불참';
  }

  return '';
}

export function parseLearningState(state?: LearningState) {
  //
  if (state === 'Progress') {
    return LearningStateEnum.Progress;
  }

  if (state === 'Passed') {
    return LearningStateEnum.Passed;
  }

  if (state === 'Missed') {
    return LearningStateEnum.Missed;
  }

  if (state === 'NoShow') {
    return LearningStateEnum.NoShow;
  }

  return LearningStateEnum.Empty;
}
