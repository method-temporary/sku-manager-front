import { axiosApi as axios } from 'shared/axios/Axios';
import { DataSelectCallModel } from '../../model/DataSelectCallModel';

class DataSelectCallApi {
  //
  communityURL = '/api/data-search/community-select';

  static instance: DataSelectCallApi;

  /** 커뮤니티 전체 조회 Api
   * @Method GET
   * @Param(Body)
   */
  findAllCommunity() {
    //
    return axios.get<DataSelectCallModel[]>(`${this.communityURL}`).then((response) => response.data || null);
  }
}

DataSelectCallApi.instance = new DataSelectCallApi();
export default DataSelectCallApi;
