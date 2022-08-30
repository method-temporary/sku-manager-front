import { SearchPeriodType } from '../model/vo';
import BannerBundleRdo from '../model/BannerBundleRdo';

export const getInitBannerBundleRdo = (): BannerBundleRdo => ({
  language: '',
  state: '',
  name: '',
  startDate: 0,
  endDate: 0,
  groupSequences: [],
  limit: 0,
  offset: 0,
  type: SearchPeriodType.Usage,
});
