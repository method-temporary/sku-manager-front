import { createStore } from 'shared/store';

export const [setTestListPage, onTestListPage, getTestListPage, useTestListPage] = createStore<number>(1);
