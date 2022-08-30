import { createStore } from './Store';
import CompetencyCdo from '../model/CompetencyCdo';

const [
  setCompetencyCdo,
  onCompetencyCdo,
  getCompetencyCdo,
  useCompetencyCdo,
] = createStore<CompetencyCdo>();

export {
  setCompetencyCdo,
  onCompetencyCdo,
  getCompetencyCdo,
  useCompetencyCdo,
};
