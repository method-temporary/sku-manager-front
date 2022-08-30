import qs from 'qs';

import { axiosApi as axios } from 'shared/axios/Axios';
import { NameValueList, OffsetElementList } from 'shared/model';

import { BadgeCategoryCdo, BadgeCategoryRdo, BadgeCategoryModel } from '../model';

export default class BadgeCategoryApi {
  //
  URL_ADMIN = '/api/badge/badgeCategories/admin';

  static instance: BadgeCategoryApi;

  registerBadgeCategory(badgeCategoryCdo: BadgeCategoryCdo): Promise<string> {
    //
    return axios.post(this.URL_ADMIN, badgeCategoryCdo).then((response) => (response && response.data) || '');
  }

  findBadgeCategory(badgeCategoryId: string): Promise<BadgeCategoryModel> {
    //
    return axios.get(this.URL_ADMIN + `/${badgeCategoryId}`).then((response) => (response && response.data) || null);
  }

  findAllBadgeCategories(badgeCategoryRdo: BadgeCategoryRdo): Promise<OffsetElementList<BadgeCategoryModel>> {
    //
    return axios
      .get(this.URL_ADMIN, {
        params: badgeCategoryRdo,
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'comma' }),
      })
      .then((response) => OffsetElementList.fromResponse(response.data));
  }

  modifyBadgeCategory(badgeCategoryId: string, nameValues: NameValueList): Promise<string> {
    //
    return axios
      .put(this.URL_ADMIN + `/${badgeCategoryId}`, nameValues)
      .then((response) => (response && response.data) || '');
  }

  removeBadgeCategory(badgeCategoryIds: string[]) {
    //
    return axios.delete(this.URL_ADMIN, { data: badgeCategoryIds }).then((response) => response && response.data);
  }

  modifyBadgeDisplayOrder(badgeCategoryIds: string[]) {
    //
    return axios.put(`${this.URL_ADMIN}/modifyDisplayOrders`, badgeCategoryIds).then((response) => response.data);
  }
}

Object.defineProperty(BadgeCategoryApi, 'instance', {
  value: new BadgeCategoryApi(),
  writable: false,
  configurable: false,
});
