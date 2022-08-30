import dayjs from 'dayjs';
import { langSupportCdo } from 'shared/components/Polyglot';
import { BannerBundleCdo } from '_data/arrange/bannnerBundles/model';
import { BannerBundleFormModel } from '../../model/BannerBundleFormModel';

export const getBannerBundleCdo = (bannerBundleForm: BannerBundleFormModel): BannerBundleCdo => {
  return {
    name: bannerBundleForm.name,
    startDate: (bannerBundleForm.startDate && bannerBundleForm.startDate) || dayjs().toDate().setHours(0, 0, 0, 0),
    endDate: bannerBundleForm.endState
      ? 0
      : (bannerBundleForm.endDate && bannerBundleForm.endDate) || dayjs().toDate().setHours(23, 59, 59, 59),

    bannerIds: bannerBundleForm.bannerIds,

    groupBasedAccessRule: bannerBundleForm.groupBasedAccessRule,
    top: bannerBundleForm.top,
    exposureType: bannerBundleForm.exposureType,
    langSupports: langSupportCdo(bannerBundleForm.langSupports),
  };
};
