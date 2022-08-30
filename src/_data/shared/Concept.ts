import { Term } from './Term';

export interface Concept {
  displaySort: number;
  id: string;
  name: string;
  terms: Term[];
}
