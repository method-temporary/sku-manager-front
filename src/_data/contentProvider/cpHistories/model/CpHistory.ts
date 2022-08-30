import { CpHistoryCategory } from './CpHistoryCategory';

export interface CpHistory {
  //
  id: string;
  cpSyncHistoryCategory: CpHistoryCategory;
  denizenId: string;
  startDate: number;
  requestTime: number;
  completeTime: number;
  count: number;
}
