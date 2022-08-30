import moment from 'moment';
import { GroupBasedAccessRule, NameValueList, PolyglotModel } from 'shared/model';
import { LangSupport, langSupportCdo } from 'shared/components/Polyglot';
import { BannerBundleWithBannerRom } from '_data/arrange/bannnerBundles/model';

import { BannerBundleFormModel } from '../../model/BannerBundleFormModel';

export const fromBannerBundleWithBannerRom = (
  bannerBundleWithBannerRom: BannerBundleWithBannerRom
): BannerBundleFormModel => {
  const bannerBundleForm = new BannerBundleFormModel();
  const groupBasedAccessRule = new GroupBasedAccessRule(bannerBundleWithBannerRom.groupBasedAccessRule);
  const registrantName = new PolyglotModel(bannerBundleWithBannerRom.registrantName);
  const langSupports =
    (bannerBundleWithBannerRom.langSupports &&
      bannerBundleWithBannerRom.langSupports.map((target) => new LangSupport(target))) ||
    [];

  return {
    ...bannerBundleForm,
    exposureType: bannerBundleWithBannerRom.exposureType,
    id: bannerBundleWithBannerRom.id,
    area: bannerBundleWithBannerRom.area,
    intervalTime: bannerBundleWithBannerRom.intervalTime,
    registeredTime: bannerBundleWithBannerRom.registeredTime,
    name: bannerBundleWithBannerRom.name,
    registrantName,
    modifiedTime: bannerBundleWithBannerRom.modifiedTime,
    modifierName: bannerBundleWithBannerRom.modifierName,

    startDate: bannerBundleWithBannerRom.startDate,
    endDate: bannerBundleWithBannerRom.endDate,

    groupBasedAccessRule,

    banners: bannerBundleWithBannerRom.banners,
    endState: bannerBundleWithBannerRom.endDate === null || bannerBundleWithBannerRom.endDate === 0,
    top: bannerBundleWithBannerRom.top,

    langSupports,
  };
};

export const getBannerNameValueList = (bannerBundleForm: BannerBundleFormModel): NameValueList => {
  return {
    nameValues: [
      {
        name: 'exposureType',
        value: bannerBundleForm.exposureType === null ? '' : bannerBundleForm.exposureType,
      },
      {
        name: 'name',
        value: bannerBundleForm.name,
      },
      {
        name: 'langSupports',
        value: JSON.stringify(langSupportCdo(bannerBundleForm.langSupports)),
      },
      {
        name: 'intervalTime',
        value: JSON.stringify(bannerBundleForm.intervalTime),
      },
      {
        name: 'bannerIds',
        value: JSON.stringify(bannerBundleForm.bannerIds),
      },
      {
        name: 'groupBasedAccessRule',
        value: JSON.stringify(bannerBundleForm.groupBasedAccessRule),
      },
      {
        name: 'startDate',
        value: String((bannerBundleForm.startDate && bannerBundleForm.startDate) || moment().toDate().getTime()),
      },
      {
        name: 'endDate',
        value: String(
          bannerBundleForm.endState
            ? 0
            : (bannerBundleForm.endDate && bannerBundleForm.endDate) || moment().toDate().getTime()
        ),
      },
      {
        name: 'top',
        value: String(bannerBundleForm.top),
      },
    ],
  };
};
