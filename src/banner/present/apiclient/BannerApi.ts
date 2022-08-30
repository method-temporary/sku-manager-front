import { axiosApi as axios, getAxiosErrorXMessage } from 'shared/axios/Axios';
import { NameValueList, OffsetElementList } from 'shared/model';

import { BannerCdo } from '../../model/BannerCdo';
import { BannerRdo } from '../../model/BannerRdo';
import { BannerModel } from '../../model/BannerModel';

export default class BannerApi {
  URL = '/api/banner';
  bannerURL = '/api/arrange/banners';
  bannerAdminURL = '/api/arrange/banners/admin';
  depotUrl = '/api/depot/vaultFile/flow/upload/file/banner';

  static instance: BannerApi;

  registerBanner(bannerCdo: BannerCdo): Promise<String> {
    // registerBanner
    console.log(bannerCdo);
    return axios
      .post<string>(this.bannerAdminURL, bannerCdo)
      .then((response) => (response && response.data) || '')
      .catch((e) => getAxiosErrorXMessage(e));
  }

  findAllBanners(limit: number, offset: number): Promise<BannerModel[]> {
    // findAllBanners
    return axios
      .get<BannerModel[]>(this.bannerURL + `/all?limit=${limit}&offset=${offset}`)
      .then((response) => (response && response.data && response.data.map((banner) => new BannerModel(banner))) || []);
  }

  findSearchBanner(bannerRdo: BannerRdo): Promise<OffsetElementList<BannerModel>> {
    //findSearchBanner
    return axios
      .get(this.bannerAdminURL, { params: bannerRdo })
      .then((response) => OffsetElementList.fromResponse(response.data));
  }

  findBannerById(bannerId: string): Promise<BannerModel> {
    //findBannerById
    return axios
      .get<BannerModel>(this.bannerURL + `/${bannerId}`)
      .then((response) => (response && response.data) || null);
  }

  modifyBanner(bannerId: string, nameValueList: NameValueList): Promise<string> {
    //
    return axios
      .put(this.bannerAdminURL + `/${bannerId}`, nameValueList)
      .then((response) => response.data || '')
      .catch((e) => getAxiosErrorXMessage(e));
  }

  removeBanner(bannerId: string): Promise<string> {
    //
    return axios.delete(this.bannerAdminURL + `/${bannerId}`).then((response) => (response && response.data) || '');
  }

  findBannerEnrollment(bannerEnrollmentId: number | string) {
    //
    return axios
      .get<BannerModel>(this.URL + `${bannerEnrollmentId}`)
      .then((response) => (response && response.data && new BannerModel(response.data)) || new BannerModel());
  }

  modifyBannerEnrollment(bannerId: string, nameValues: NameValueList) {
    //
    return axios.put<void>(this.URL + `/${bannerId}`, nameValues);
  }

  findAllbannerEnrollmentsByQuery(bannerRdo: BannerRdo) {
    //
    return axios
      .get<OffsetElementList<BannerModel>>(this.bannerURL + `filter`, { params: bannerRdo })
      .then(
        (response: any) =>
          (response && response.data && new OffsetElementList<BannerModel>(response.data)) || new OffsetElementList()
      );
  }

  bannerFileUpload(file?: File) {
    const frm = new FormData();
    // @ts-ignore
    frm.append('file', file);

    return axios
      .post(this.depotUrl, frm, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => (response && response.data) || null);
  }
}

Object.defineProperty(BannerApi, 'instance', {
  value: new BannerApi(),
  writable: false,
  configurable: false,
});
