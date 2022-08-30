import { createStore } from 'shared/store';

export const [setSmsListLimit, onSmsListLimit, getSmsListLimit, useSmsListLimit] = createStore<number>(20);
