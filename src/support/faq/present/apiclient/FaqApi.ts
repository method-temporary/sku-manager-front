import CategoryCdo from '../../../category/model/sdo/CategoryCdo';
import { axiosApi } from 'shared/axios/Axios';
import { NameValueList } from 'shared/model';
import FaqAdminRdo from '../../model/sdo/FaqAdminRdo';
import FaqModel from 'support/faq/model/FaqModel';

class FaqApi {
  // TODO: URL Fix
  static instance: FaqApi;

  URL = '/faq/admin';

  register(categoryCdo: CategoryCdo): Promise<string> {
    //
    return axiosApi.postLoader(this.URL, categoryCdo).then((response) => (response && response.data) || null);
  }

  modify(id: string, nameValueList: NameValueList): Promise<void> {
    //
    return axiosApi
      .putLoader(this.URL + `/id?=${id}`, nameValueList)
      .then((response) => (response && response.data) || null);
  }

  findByRdo(faqAdminRdo: FaqAdminRdo): Promise<FaqModel[]> {
    //
    return axiosApi
      .getLoader(this.URL, { params: faqAdminRdo })
      .then((response) => (response && response.data) || null);
  }

  findById(faqId: string): Promise<FaqModel> {
    //
    return axiosApi.getLoader(this.URL, { params: faqId }).then((response) => (response && response.data) || null);
  }
}

export default FaqApi;
FaqApi.instance = new FaqApi();
