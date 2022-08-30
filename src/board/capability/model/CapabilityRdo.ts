import { SEARCH_TYPE, COMPETENCY_TYPE } from '../store/CapabilityRdoStore';

export default interface CapabilityRdo {
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
  capabilityType: COMPETENCY_TYPE;
}
