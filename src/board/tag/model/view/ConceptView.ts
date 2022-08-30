import Term from './TermView';

export default interface ConceptView {
  id: string;
  name: string;
  terms: Term[];
}
