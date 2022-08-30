import { createStore } from './Store';
import ConceptCdo from '../model/ConceptCdo';

const [
  setConceptCdo,
  onConceptCdo,
  getConceptCdo,
  useConceptCdo,
] = createStore<ConceptCdo>();

export {
  setConceptCdo,
  onConceptCdo,
  getConceptCdo,
  useConceptCdo,
};
