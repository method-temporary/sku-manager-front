import { SEARCH_DATE_TYPE } from 'dashBoard/store/DashBoardSentenceRdoStore';

export default interface DashBoardRdo {
  startDate: number;
  endDate: number;
  state: string;
  show?: boolean | undefined;
  keywords: string;
  searchWord: string;
  name: string;
  limit: number;
  offset: number;
  dateOptions: SEARCH_DATE_TYPE;
}
