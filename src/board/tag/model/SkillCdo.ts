import Concept from './Concept';

export default interface TermCdo {
  id: string;
  name: string;
  concept: Concept;
  synonymTag: string;
  creatorName: string;
  modifierName: string;
}
