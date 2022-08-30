import { CardBundleModifyModel } from 'cardbundle/present/logic/CardBundleModifyModel';
import qs from 'qs';
import { axiosApi as axios } from 'shared/axios/Axios';
import { NameValueList, OffsetElementList } from 'shared/model';

import { CardBundleCdo, CardBundleRdo, CardBundleModel } from '../model';

export default class CardBundleApi {
  //
  URL = '/api/arrange/admin/cardBundles';

  static instance: CardBundleApi;

  registerCardBundle(cardBundleCdo: CardBundleCdo): Promise<string> {
    return axios.post(this.URL, cardBundleCdo).then((response) => (response && response.data) || '');
  }

  findAllCardBundles(cardBundleRdo: CardBundleRdo): Promise<OffsetElementList<CardBundleModel>> {
    return axios
      .get(this.URL, {
        params: {
          ...cardBundleRdo,
          groupSequences: cardBundleRdo.groupSequences.slice(),
          types: cardBundleRdo.types.slice(),
        },
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'comma' }),
      })
      .then((response) => OffsetElementList.fromResponse(response.data));
  }

  findCardBundle(cardBundleId: string): Promise<CardBundleModel> {
    return axios.get(this.URL + `/${cardBundleId}`).then((response) => (response && response.data) || null);
  }

  modifyCardBundle(cardBundleId: string, nameValueList: NameValueList): Promise<string> {
    return axios
      .put(this.URL + `/${cardBundleId}`, nameValueList)
      .then((response) => (response && response.data) || '');
  }

  modifyCardBundlesDisplayOrder(params: CardBundleModifyModel): Promise<string> {
    return axios.put(this.URL + `/displayOrder`, params).then((response) => (response && response.data) || '');
  }

  enableCardBundles(cardIds: string[]): Promise<string> {
    return axios.put(this.URL + `/enable`, cardIds).then((response) => (response && response.data) || '');
  }

  disableCardBundles(cardIds: string[]): Promise<string> {
    return axios.put(this.URL + `/disable`, cardIds).then((response) => (response && response.data) || '');
  }

  removeCardBundles(cardBundleIds: string[]) {
    return axios.delete(this.URL, { data: cardBundleIds }).then((response) => (response && response.data) || '');
  }
}

Object.defineProperty(CardBundleApi, 'instance', {
  value: new CardBundleApi(),
  writable: false,
  configurable: false,
});
