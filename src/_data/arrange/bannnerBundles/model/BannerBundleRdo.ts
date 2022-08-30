import { SearchPeriodType } from './vo';

export default interface BannerBundleRdo {
  //
  language: string;
  state: string;
  name: string;
  startDate: number;
  endDate: number;

  groupSequences: number[];

  limit: number;
  offset: number;

  type: SearchPeriodType;
}
