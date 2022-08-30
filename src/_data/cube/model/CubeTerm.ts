import { Term } from '../../shared/Term';

export interface CubeTerm {
  displaySort: number;
  id: string;
  name: string;
  terms: Term[];
}
