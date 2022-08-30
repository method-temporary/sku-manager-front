import { createStore } from 'shared/store';

export const [setTestListLimit, onTestListLimit, getTestListLimit, useTestListLimit] = createStore<number>(
  getInitialTestListLimit()
);

export function getInitialTestListLimit(): number {
  return 20;
}
