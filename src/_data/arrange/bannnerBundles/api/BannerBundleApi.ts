import qs from 'qs';

import { axiosApi as axios, getAxiosErrorXMessage } from 'shared/axios/Axios';
import { NameValueList, OffsetElementList } from 'shared/model';

import { BannerBundleRdo, BannerBundleCdo, BannerBundleWithBannerRom } from '../model';

export default class BannerBundleApi {
  //
  URL_ADMIN = '/api/arrange/bannerBundles/admin';

  static instance: BannerBundleApi;

  registerBannerBundle(bannerBundleCdo: BannerBundleCdo): Promise<string> {
    return axios
      .post<string>(this.URL_ADMIN, bannerBundleCdo)
      .then((response) => (response && response.data) || '')
      .catch((e) => getAxiosErrorXMessage(e));
  }

  findBannerBundleDetail(bannerBundleId: string): Promise<BannerBundleWithBannerRom> {
    return axios
      .get<BannerBundleWithBannerRom>(this.URL_ADMIN + `/${bannerBundleId}`)
      .then((response) => (response && response.data) || null);
  }

  findSearchBannerBundle(bannerBundleRdo: BannerBundleRdo): Promise<OffsetElementList<BannerBundleWithBannerRom>> {
    return axios
      .get<OffsetElementList<BannerBundleWithBannerRom>>(this.URL_ADMIN, {
        params: {
          ...bannerBundleRdo,
          groupSequences: bannerBundleRdo.groupSequences.slice(),
        },
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'comma' }),
      })
      .then((response) => OffsetElementList.fromResponse(response.data));
  }

  modifyBannerBundle(bannerBundleId: string, nameValueList: NameValueList): Promise<string> {
    return axios
      .put<string>(this.URL_ADMIN + `/${bannerBundleId}`, nameValueList)
      .then((response) => (response && response.data) || '')
      .catch((e) => getAxiosErrorXMessage(e));
  }

  removeBannerBundle(bannerBundleId: string): Promise<string> {
    return axios.delete(this.URL_ADMIN + `/${bannerBundleId}`).then((response) => (response && response.data) || '');
  }
}

Object.defineProperty(BannerBundleApi, 'instance', {
  value: new BannerBundleApi(),
  writable: false,
  configurable: false,
});
