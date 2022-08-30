import { SEARCH_TYPE } from '../store/SerchTagRdoStore';

export default interface SearchTagRdo {
  startDate: number;
  endDate: number;
  tag: string;
  keywords: string;
  creator: string;
  modifier: string;
  text: string;
  limit: number;
  offset: number;
  searchType: SEARCH_TYPE;
}
