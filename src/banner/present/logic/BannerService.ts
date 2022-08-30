import { observable, action, runInAction } from 'mobx';
import autobind from 'autobind-decorator';
import _ from 'lodash';

import { NameValueList, PolyglotModel } from 'shared/model';

import BannerApi from '../apiclient/BannerApi';
import { BannerQueryModel } from '../../model/BannerQueryModel';
import { BannerCdo } from '../../model/BannerCdo';
import { BannerRdo } from '../../model/BannerRdo';
import { BannerModel } from '../../model/BannerModel';

export const getBannerItem = (
  images: {
    alt: PolyglotModel;
    exposureType: 'PC' | 'Mobile';
    url: PolyglotModel;
  }[],
  exposureType: 'PC' | 'Mobile'
) => {
  const banner = images?.find((image) => image.exposureType === exposureType);
  const imageUrl = new PolyglotModel(banner?.url);
  const imageAlt = new PolyglotModel(banner?.alt);

  return {
    alt: imageAlt,
    exposureType,
    url: imageUrl,
  };
};

export const getBannerItems = (
  images: {
    alt: PolyglotModel;
    exposureType: 'PC' | 'Mobile';
    url: PolyglotModel;
  }[],
  exposureType: 'PC' | 'Mobile'
) => {
  const banners = images.filter((image) => image.exposureType === exposureType);
  console.log(exposureType, banners);
  return banners;
};

export const isEmptyPolyglotModel = (polyglotModel: PolyglotModel) => {
  if (polyglotModel.ko !== '' || polyglotModel.en !== '' || polyglotModel.zh !== '') {
    return false;
  }

  return true;
};

@autobind
export default class BannerService {
  //
  static instance: BannerService;

  bannerApi: BannerApi;

  @observable
  banner: BannerModel = new BannerModel();

  @observable
  banners: BannerModel[] = [];

  @observable
  bannerQuery: BannerQueryModel = new BannerQueryModel();

  @observable
  bannerCount: any;

  @observable
  pcFileName: PolyglotModel = new PolyglotModel();

  @observable
  mobileFileName: PolyglotModel = new PolyglotModel();

  @observable
  bannerArrangeIndex: number = 0;

  @observable
  BannerOrganizationListModalOpen: boolean = false;

  constructor(bannerApi: BannerApi) {
    this.bannerApi = bannerApi;
  }

  registerBanner() {
    //
    return this.bannerApi.registerBanner(BannerCdo.fromModel(this.banner));
  }

  @action
  async findSearchBanner(bannerRdo: BannerRdo) {
    //
    const offsetElementList = await this.bannerApi.findSearchBanner(bannerRdo);
    runInAction(() => {
      this.banners = offsetElementList.results;
    });
    return offsetElementList;
  }

  @action
  async findBannerById(bannerId: string) {
    //
    const banner = await this.bannerApi.findBannerById(bannerId);

    runInAction(() => {
      this.banner = new BannerModel(banner);
      this.pcFileName = getBannerItem(banner.images, 'PC').alt;
      this.mobileFileName = getBannerItem(banner.images, 'Mobile').alt;
    });
  }

  @action
  changeBannerProps(name: string, value: string | {} | string[]) {
    //
    this.banner = _.set(this.banner, name, value);
  }

  modifyBanner(bannerId: string, nameValueList: NameValueList): Promise<string> {
    //
    return this.bannerApi.modifyBanner(bannerId, nameValueList);
  }

  @action
  removeBanner(bannerId: string) {
    //
    return this.bannerApi.removeBanner(bannerId);
  }

  @action
  clearBanner() {
    //
    this.banner = new BannerModel();
  }

  @action
  clearBanners() {
    //
    this.banners = [];
  }

  @action
  clearBannerQueryProps() {
    //
    this.bannerQuery = new BannerQueryModel();
  }

  @action
  changeBannerQueryProps(name: string, value: any) {
    if (value === '전체') value = '';
    this.bannerQuery = _.set(this.bannerQuery, name, value);
  }

  @action
  changeTargetPageElementProps(index: number, name: string, value: any) {
    // 체크박스 이벤트 처리 함수
    this.banners = _.set(this.banners, `[${index}].${name}`, value);
  }

  @action
  findAllBannerForExcel() {
    // ??
    return this.bannerApi.findAllBanners(50000, 0);
  }

  // ----------------------------------------------------------------------------
  @action
  async bannerFileUpload(file: File) {
    //
    return this.bannerApi.bannerFileUpload(file);
  }

  @action
  clearFileNamePc() {
    //
    this.pcFileName = new PolyglotModel();
  }

  @action
  changeFileNamePc(name: PolyglotModel) {
    this.pcFileName = name;
  }

  @action
  clearFileNameMobile() {
    //
    this.mobileFileName = new PolyglotModel();
  }

  @action
  changeFileNameMobile(name: PolyglotModel) {
    this.mobileFileName = name;
  }

  @action
  changeBannerExposureType(value: 'PC' | 'Mobile', isChecked?: boolean) {
    if (isChecked) {
      if (value === 'PC') {
        if (this.banner.exposureType === 'Mobile') {
          this.banner.exposureType = null;
        } else {
          this.banner.exposureType = 'PC';
        }
      }

      if (value === 'Mobile') {
        if (this.banner.exposureType === 'PC') {
          this.banner.exposureType = null;
        } else {
          this.banner.exposureType = 'Mobile';
        }
      }
    } else {
      if (value === 'PC') {
        if (this.banner.exposureType === null) {
          this.banner.exposureType = 'Mobile';
        } else {
          this.banner.exposureType = '';
        }
      }

      if (value === 'Mobile') {
        if (this.banner.exposureType === null) {
          this.banner.exposureType = 'PC';
        } else {
          this.banner.exposureType = '';
        }
      }
    }
  }
}

Object.defineProperty(BannerService, 'instance', {
  value: new BannerService(BannerApi.instance),
  writable: false,
  configurable: false,
});
