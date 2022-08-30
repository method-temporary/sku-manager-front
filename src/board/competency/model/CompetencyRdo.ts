import { SEARCH_TYPE, COMPETENCY_TYPE } from '../store/CompetencyRdoStore';

export default interface CompetencyRdo {
  startDate: number;
  endDate: number;
  tag: string;
  keywords: string;
  creator: string;
  updater: string;
  text: string;
  limit: number;
  offset: number;
  searchType: SEARCH_TYPE;
  competencyType: COMPETENCY_TYPE;
}
