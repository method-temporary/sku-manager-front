import { axiosApi as axios } from 'shared/axios/Axios';

import { SubtitleModel } from '../../model/SubtitleModel';
import { SubtitleUdoModel } from '../../model/SubtitleUdoModel';
import { SubtitleCdoModel } from '../../model/SubtitleCdoModel';

export default class SubtitleApi {
  URL = '/api/cube/subtitles';

  static instance: SubtitleApi;

  registerSubtitle(SubtitleCdo: SubtitleCdoModel) {
    return axios.post(this.URL, SubtitleCdo).then((response) => (response && response.data) || null);
  }

  findSubtitle(deliveryId: string, locale: string) {
    return axios
      .get<SubtitleModel>(`${this.URL}/${deliveryId}/${locale}`)
      .then((response) => response && response.data);
  }

  modifySubtitle(deliveryId: string, locale: string, subtitleUdoModel: SubtitleUdoModel) {
    return axios
      .put(this.URL + `/${deliveryId}/${locale}`, subtitleUdoModel)
      .then((response) => (response && response.data) || null);
  }

  removeSubtitle(deliveryId: string, locale: string): Promise<any> {
    return axios.delete(`${this.URL}/${deliveryId}/${locale}`);
  }
}

Object.defineProperty(SubtitleApi, 'instance', {
  value: new SubtitleApi(),
  writable: false,
  configurable: false,
});
