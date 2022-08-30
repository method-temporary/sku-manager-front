import { createStore } from 'shared/store';

export const [setSmsListPage, onSmsListPage, getSmsListPage, useSmsListPage] = createStore<number>(1);
