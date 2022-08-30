import qs from 'qs';

import { axiosApi as axios } from 'shared/axios/Axios';
import { NameValueList, OffsetElementList } from 'shared/model';

import { PageElementModel } from '../../../../pageelement';
import { PageElementRdo } from '../model/PageElementRdo';

export default class PageElementManagementApi {
  //
  PageElementUrl = '/api/arrange/pageElements';

  static instance: PageElementManagementApi;

  findAllPageElements(pageElementRdo: PageElementRdo): Promise<OffsetElementList<PageElementModel>> {
    //
    return axios
      .get(`${this.PageElementUrl}`, {
        params: pageElementRdo,
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: 'comma' });
        },
      })
      .then((response) => OffsetElementList.fromResponse(response.data) || null);
  }

  findPageElementById(id: string): Promise<PageElementModel> {
    //
    return axios.get(`${this.PageElementUrl}/${id}`).then((response) => (response && response.data) || null);
  }

  registerPageElement(pageElement: PageElementModel): Promise<string> {
    //
    return axios.post(`${this.PageElementUrl}`, pageElement).then((response) => (response && response.data) || '');
  }

  updatePageElement(pageElementId: string, nameValueList: NameValueList): Promise<string> {
    //
    return axios
      .put(`${this.PageElementUrl}/${pageElementId}`, nameValueList)
      .then((response) => (response && response.data) || '');
  }

  deletePageElementById(ids: string[]): Promise<string> {
    //
    return axios.delete(`${this.PageElementUrl}/${ids}`).then((response) => (response && response.data) || '');
  }
}

Object.defineProperty(PageElementManagementApi, 'instance', {
  value: new PageElementManagementApi(),
  writable: false,
  configurable: false,
});
