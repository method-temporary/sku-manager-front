import { action, observable, runInAction } from 'mobx';
import autobind from 'autobind-decorator';
import _ from 'lodash';

import { NameValueList, OffsetElementList } from 'shared/model';

import BannerBundleApi from '_data/arrange/bannnerBundles/api/BannerBundleApi';
import { BannerBundleCdo, BannerBundleRdo, BannerBundleWithBannerRom } from '_data/arrange/bannnerBundles/model';
import { getInitBannerBundleRdo } from '_data/arrange/bannnerBundles/util';

import { fromBannerBundleWithBannerRom } from '../../shared/util';

import { BannerModel } from '../..';
import { BannerBundleFormModel } from '../../model/BannerBundleFormModel';
import { AlertModel } from 'shared/components';

@autobind
export default class BannerBundleService {
  //
  static instance: BannerBundleService;

  bannerBundleApi: BannerBundleApi;

  @observable
  bannerBundleRdo: BannerBundleRdo = getInitBannerBundleRdo();

  @observable
  bannerBundles: BannerBundleWithBannerRom[] = [];

  @observable
  bannerBundleForm: BannerBundleFormModel = new BannerBundleFormModel();

  @observable
  selectedBanners: BannerModel[] = [];

  constructor(bannerBundleApi: BannerBundleApi) {
    this.bannerBundleApi = bannerBundleApi;
  }

  async registerBannerBundle(bannerBundleCdo: BannerBundleCdo) {
    return this.bannerBundleApi.registerBannerBundle(bannerBundleCdo);
  }

  @action
  changeBannerBundleRdoProps(name: string, value: any) {
    //
    this.bannerBundleRdo = _.set(this.bannerBundleRdo, name, value);
  }

  @action
  async findSearchBannerBundle(bannerRdo: BannerBundleRdo): Promise<OffsetElementList<BannerBundleWithBannerRom>> {
    //
    const offsetElementList = await this.bannerBundleApi.findSearchBannerBundle(bannerRdo);

    runInAction(() => {
      this.bannerBundles = offsetElementList.results && offsetElementList.results.map((bannerBundle) => bannerBundle);
    });

    return offsetElementList;
  }

  @action
  async findBannerBundleDetail(bannerBundleId: string): Promise<BannerBundleFormModel> {
    //
    const targetBundle = await this.bannerBundleApi.findBannerBundleDetail(bannerBundleId);

    runInAction(() => {
      this.bannerBundleForm = fromBannerBundleWithBannerRom(targetBundle);
    });

    return this.bannerBundleForm;
  }

  async modifyBannerBundle(bannerBundleId: string, nameValueList: NameValueList) {
    //
    return this.bannerBundleApi.modifyBannerBundle(bannerBundleId, nameValueList);
  }

  async removeBannerBundle(bannerBundleId: string): Promise<string> {
    //
    return this.bannerBundleApi.removeBannerBundle(bannerBundleId);
  }

  @action
  addBannerInBannerBundle(banner: BannerModel) {
    //
    this.selectedBanners.push(banner);
  }

  @action
  clearBannerBannerBundleForm() {
    //
    this.bannerBundleForm = new BannerBundleFormModel();
  }

  @action
  clearBannerBundles() {
    //
    this.bannerBundles = [];
  }

  @action
  clearSelectedBanners() {
    //
    this.selectedBanners = [];
  }

  @action
  changeBannerSequence(banner: BannerModel, oldSeq: number, newSeq: number) {
    //
    if (newSeq > -1 && newSeq < this.selectedBanners.length) {
      this.selectedBanners.splice(oldSeq, 1);
      this.selectedBanners.splice(newSeq, 0, banner);
    }
  }

  @action
  removeBannerInBannerBundle(index: number) {
    this.selectedBanners.splice(index, 1);
  }

  @action
  changeBannerBundleProps(name: string, value: string | {} | string[]) {
    //
    this.bannerBundleForm = _.set(this.bannerBundleForm, name, value);
  }

  @action
  changeBannerBundleFormProps(name: string, value: any) {
    //
    this.bannerBundleForm = _.set(this.bannerBundleForm, name, value);
  }

  @action
  changeBannerBundleExposureType(value: 'PC' | 'Mobile', isChecked?: boolean) {
    if (isChecked) {
      if (value === 'PC') {
        if (this.bannerBundleForm.exposureType === 'Mobile') {
          this.bannerBundleForm.exposureType = null;
        } else {
          this.bannerBundleForm.exposureType = 'PC';
        }
      }

      if (value === 'Mobile') {
        if (this.bannerBundleForm.exposureType === 'PC') {
          this.bannerBundleForm.exposureType = null;
        } else {
          this.bannerBundleForm.exposureType = 'Mobile';
        }
      }
    } else {
      if (value === 'PC') {
        if (this.bannerBundleForm.exposureType === null) {
          this.bannerBundleForm.exposureType = 'Mobile';
        } else {
          this.bannerBundleForm.exposureType = '';
        }
      }

      if (value === 'Mobile') {
        if (this.bannerBundleForm.exposureType === null) {
          this.bannerBundleForm.exposureType = 'PC';
        } else {
          this.bannerBundleForm.exposureType = '';
        }
      }
    }
  }
}

Object.defineProperty(BannerBundleService, 'instance', {
  value: new BannerBundleService(BannerBundleApi.instance),
  writable: false,
  configurable: false,
});
