import { PolyglotModel, GroupBasedAccessRule, PatronKey } from 'shared/model';
import { LangSupport } from 'shared/components/Polyglot';

import { BannerModel } from 'banner';

export class BannerBundleWithBannerRom {
  //
  exposureType: 'PC' | 'Mobile' | null = 'PC';
  id: string = '';
  area: number = 0;
  intervalTime: number = 0;
  registeredTime: number = 0;
  state: string = '';
  name: string = '';
  creatorId: string = '';
  registrantName: PolyglotModel = new PolyglotModel();
  modifiedTime: number = 0;
  modifierName: string = '';
  groupBasedAccessRule: GroupBasedAccessRule = new GroupBasedAccessRule();
  startDate: number = 0;
  endDate: number = 0;

  banners: BannerModel[] = [];
  top: boolean = false;

  langSupports: LangSupport[] = [];
  patronKey: PatronKey = new PatronKey();

  constructor(bannerBundleWithBannerRom?: BannerBundleWithBannerRom) {
    if (bannerBundleWithBannerRom) {
      const registrantName = new PolyglotModel(bannerBundleWithBannerRom.registrantName);
      const groupBasedAccessRule = new GroupBasedAccessRule(bannerBundleWithBannerRom.groupBasedAccessRule);
      Object.assign(this, { ...bannerBundleWithBannerRom, registrantName, groupBasedAccessRule });
    }
  }
}
