import { createStore } from './store';
import { CineroomModel } from 'shared/model';

export const [setCinerooms, onCinerooms, getCinerooms, useCinerooms] = createStore<CineroomModel[]>();
