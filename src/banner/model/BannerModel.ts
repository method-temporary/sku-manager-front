import { computed, decorate, observable } from 'mobx';
import moment from 'moment';

import { patronInfo } from '@nara.platform/dock';

import { NameValueList, PolyglotModel, DramaEntityObservableModel, NewDatePeriod } from 'shared/model';
import {
  LangSupport,
  langSupportCdo,
  getDefaultLanguage,
  getPolyglotToAnyString,
  DEFAULT_LANGUAGE,
} from 'shared/components/Polyglot';

import { SearchFilter } from './SearchFilter';
import { BannerCdo } from './BannerCdo';
import { getBannerItem } from 'banner/present/logic/BannerService';

export class BannerModel extends DramaEntityObservableModel {
  //
  selected: boolean = false;
  exposureType: 'PC' | 'Mobile' | '' | null = null;
  language: number = 1;
  name: string = '';
  images: { alt: PolyglotModel; exposureType: 'PC' | 'Mobile'; url: PolyglotModel }[] = [];
  target: string = '';
  enabled: boolean = true;
  registrantName: PolyglotModel = new PolyglotModel();
  registeredTime: number = 0;
  imageVersion: number = 0;
  targetUrl: string = '';
  version: number = 0;
  pcImageUrl: PolyglotModel = new PolyglotModel();
  mobileImageUrl: PolyglotModel = new PolyglotModel();
  originId: number = 0;
  isUse: number = 1;
  creatorId: string = '';
  originCreatorName: string = '';
  originCreationTime: number = 0;
  searchFilter: SearchFilter | undefined = SearchFilter.SearchOn;
  period: NewDatePeriod = new NewDatePeriod();

  state: string = '';

  langSupports: LangSupport[] = [DEFAULT_LANGUAGE];

  bgColor: string = '';

  constructor(banner?: BannerModel) {
    super();
    if (banner) {
      const registrantName = new PolyglotModel(banner.registrantName);
      const langSupports = (banner.langSupports && banner.langSupports.map((target) => new LangSupport(target))) || [];
      Object.assign(this, {
        ...banner,
        pcImageUrl: getBannerItem(banner.images, 'PC').url,
        mobileImageUrl: getBannerItem(banner.images, 'Mobile').url,
        registrantName,
        langSupports,
      });
    }
  }

  @computed
  get getName(): string {
    //
    return this.name;
  }

  @computed
  get getCreationDate(): string {
    //
    return moment(this.registeredTime).format('YY.MM.DD');
  }

  @computed
  get getCreationTime(): string {
    //
    return moment(this.registeredTime).format('YY.MM.DD hh:mm');
  }

  @computed
  get getOriginCreationTime(): string {
    //
    return moment(this.originCreationTime).format('YY.MM.DD hh:mm');
  }

  static isBlank(bannerEnrollmentModel: BannerModel): string {
    if (bannerEnrollmentModel.exposureType === '') return '노출 설정';
    if (!bannerEnrollmentModel.name) return 'Banner 명';
    if (bannerEnrollmentModel.exposureType === null || bannerEnrollmentModel.exposureType === 'PC') {
      if (!getPolyglotToAnyString(bannerEnrollmentModel.images.find((image) => image.exposureType === 'PC')?.url))
        return 'PC Banner Image';
    }
    if (bannerEnrollmentModel.exposureType === null || bannerEnrollmentModel.exposureType === 'Mobile') {
      if (!getPolyglotToAnyString(bannerEnrollmentModel.images.find((image) => image.exposureType === 'Mobile')?.url))
        return 'Mobile Banner Image';
    }
    if (bannerEnrollmentModel.target === '') return 'Link CardType';
    if (!bannerEnrollmentModel.targetUrl) return 'Banner Link';
    // if (bannerEnrollmentModel.bgColor === '') return '띠배너';

    return 'success';
  }

  static asCdo(banner: BannerModel): BannerCdo {
    //
    banner.creatorId = patronInfo.getPatronEmail() || '';
    banner.registrantName.setValue(getDefaultLanguage(banner.langSupports), patronInfo.getPatronName() || '');
    return BannerCdo.fromModel(banner);
  }

  static asNameValueList(banner: BannerModel): NameValueList {
    //
    return {
      nameValues: [
        {
          name: 'exposureType',
          value: banner.exposureType || '',
        },
        {
          name: 'name',
          value: banner.name,
        },
        {
          name: 'registrantName',
          value: JSON.stringify(banner.registrantName),
        },
        {
          name: 'images',
          value: JSON.stringify(banner.images),
        },
        // {
        //   name: 'pcImageAlt',
        //   value: JSON.stringify(banner.images.find((image) => image.exposureType === 'PC')?.alt),
        // },
        // {
        //   name: 'pcImageUrl',
        //   value: JSON.stringify(banner.images.find((image) => image.exposureType === 'PC')?.url),
        // },
        // {
        //   name: 'mobileImageAlt',
        //   value: JSON.stringify(banner.images.find((image) => image.exposureType === 'Mobile')?.alt),
        // },
        // {
        //   name: 'mobileImageUrl',
        //   value: JSON.stringify(banner.images.find((image) => image.exposureType === 'Mobile')?.url),
        // },
        {
          name: 'imageVersion',
          value: JSON.stringify(banner.imageVersion),
        },
        {
          name: 'bgColor',
          value: banner.bgColor,
        },
        {
          name: 'target',
          value: banner.target,
        },
        {
          name: 'targetUrl',
          value: banner.targetUrl,
        },
        {
          name: 'langSupports',
          value: JSON.stringify(langSupportCdo(banner.langSupports)),
        },
      ],
    };
  }
}

decorate(BannerModel, {
  exposureType: observable,
  id: observable,
  language: observable,
  originId: observable,
  name: observable,
  images: observable,
  imageVersion: observable,
  target: observable,
  targetUrl: observable,
  isUse: observable,
  creatorId: observable,
  registrantName: observable,
  registeredTime: observable,
  originCreatorName: observable,
  originCreationTime: observable,
  searchFilter: observable,
  pcImageUrl: observable,
  mobileImageUrl: observable,
  langSupports: observable,

  bgColor: observable,
});
