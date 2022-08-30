import { PolyglotModel } from 'shared/model';
import { LangSupport, langSupportCdo } from 'shared/components/Polyglot';
import { BannerModel } from './BannerModel';
import { getBannerItem, isEmptyPolyglotModel } from 'banner/present/logic/BannerService';

export class BannerCdo {
  //
  exposureType: 'PC' | 'Mobile' | null = 'PC';

  name: string = '';
  images: {
    alt: PolyglotModel;
    exposureType: 'PC' | 'Mobile';
    url: PolyglotModel;
  }[] = [];

  imageVersion: number = 0;
  target: string = '';
  targetUrl: string = '';
  enabled: boolean = true;
  version: number = 0;

  langSupports: LangSupport[] = [];

  bgColor: string = '';

  static fromModel(bannerModel: BannerModel): BannerCdo {
    console.log(bannerModel);

    const pcBanner = getBannerItem(bannerModel.images, 'PC');
    const mobileBanner = getBannerItem(bannerModel.images, 'Mobile');
    const isEmptyPcBannerUrl = isEmptyPolyglotModel(pcBanner.url);
    const isEmptyMobileBannerUrl = isEmptyPolyglotModel(mobileBanner.url);
    const getBannerExposureType = () => {
      if (isEmptyMobileBannerUrl && !isEmptyPcBannerUrl) {
        return 'PC';
      }

      if (!isEmptyMobileBannerUrl && isEmptyPcBannerUrl) {
        return 'Mobile';
      }

      return null;
    };

    return {
      exposureType: getBannerExposureType(),
      name: bannerModel.name,
      images: [
        {
          exposureType: 'PC',
          alt: pcBanner.alt,
          url: pcBanner.url,
        },
        {
          exposureType: 'Mobile',
          alt: mobileBanner.alt,
          url: mobileBanner.url,
        },
      ],
      imageVersion: bannerModel.imageVersion,
      target: bannerModel.target,
      targetUrl: bannerModel.targetUrl,
      enabled: bannerModel.enabled,
      version: bannerModel.version,
      langSupports: langSupportCdo(bannerModel.langSupports),
      bgColor: bannerModel.bgColor === '' ? '#FFFFFF' : bannerModel.bgColor,
    };
  }
}
