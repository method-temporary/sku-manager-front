import { createStore } from './Store';
import Concept from '../model/Concept';

const [setConcept, onConcept, getConcept, useConcept] = createStore<
  Concept[]
>();

export { setConcept, onConcept, getConcept, useConcept };
