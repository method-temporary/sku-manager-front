import { createStore } from './store';
import { History } from 'history';

export const [setCurrentHistory, onCurrentHistory, getCurrentHistory, useCurrentHistory] = createStore<History>();
