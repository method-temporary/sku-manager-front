import { axiosApi as axios } from 'shared/axios/Axios';
import { getApiDomain } from '../../helper/urlHelper';

export default class DepotApi {
  URL = getApiDomain() + '/api/depot/vaultFile/flow/upload/file';

  static instance: DepotApi;

  uploadFile(file: File, uploadType: DepotUploadType) {
    const formData = new FormData();
    formData.append('file', file);

    return axios
      .post(`${this.URL}/${uploadType}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => (response && response.data) || null);
  }
}

export enum DepotUploadType {
  Banner = 'banner',
  BadgeIcon = 'badgeicon',
  Question = 'question',
  CollegeBanner = 'collegeBanner',
}

Object.defineProperty(DepotApi, 'instance', {
  value: new DepotApi(),
  writable: false,
  configurable: false,
});
