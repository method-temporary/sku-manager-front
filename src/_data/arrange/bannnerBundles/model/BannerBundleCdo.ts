import { GroupBasedAccessRule } from 'shared/model';
import { LangSupport } from 'shared/components/Polyglot';

import OrderedBannerId from '../../../../banner/model/OrderedBannerId';

export default interface BannerBundleCdo {
  //
  name: string;
  startDate: number;
  endDate: number;

  bannerIds: OrderedBannerId[];

  groupBasedAccessRule: GroupBasedAccessRule;
  top: boolean;
  exposureType: 'PC' | 'Mobile' | '' | null;
  langSupports: LangSupport[];
}
