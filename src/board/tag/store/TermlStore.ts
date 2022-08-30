import { createStore } from './Store';
import Term from '../model/Term';

const [setTerm, onTerm, getTerm, useTerm] = createStore<
  Term[]
>();

export { setTerm, onTerm, getTerm, useTerm };
