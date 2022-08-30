export enum LearningState {
  //
  Default = '전체',
  Progress = 'Progress',
  Waiting = 'Waiting',
  Failed = 'Failed',
  TestPassed = 'TestPassed',
  Passed = 'Passed',
  Missed = 'Missed',
  NoShow = 'NoShow',
  TestWaiting = 'TestWaiting',
  HomeworkWaiting = 'HomeworkWaiting',
  Empty = '',
}

export type LearningStateType =
  | 'Progress'
  | 'Waiting'
  | 'Failed'
  | 'TestPassed'
  | 'Passed'
  | 'Missed'
  | 'NoShow'
  | 'TestWaiting'
  | 'HomeworkWaiting'
  | '';
