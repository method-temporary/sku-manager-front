import { LearningState } from '../../model/vo/LearningState';

export function displayLearningState(state: LearningState) {
  //
  if (state === LearningState.Passed) {
    return '이수';
  }

  if (state === LearningState.Missed) {
    return '미이수';
  }

  // if (state === LearningState.Waiting || state === LearningState.Progress) {
  if (state === LearningState.Progress) {
    return '결과처리대기';
  }

  if (state === LearningState.NoShow) {
    return '불참';
  }

  return '';
}
