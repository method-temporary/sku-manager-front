import qs from 'qs';
import { axiosApi as axios } from 'shared/axios/Axios';

import { OffsetElementList } from 'shared/model';
import { apiErrorHelper } from 'shared/helper';
import { setExcelHistoryParams } from 'shared/components/SubActions/sub/ExcelButton/store/ExcelHistoryStore';

import DataCommunityRdo from '../../model/DataCommunityRdo';
import { DataCommunityModel } from '../../model/DataCommunityModel';

class DataCommunityApi {
  //
  URL = '/api/data-search/community-member/excel';

  static instance: DataCommunityApi;

  /** 커뮤니티 전체 멤버 추출 Api
   * @Method GET
   * @Param(Body) DataCommunityRdo
   */
  findCommunity(communityRdo: DataCommunityRdo): Promise<OffsetElementList<DataCommunityModel>> {
    //
    const apiUrl = `${this.URL}`;

    setExcelHistoryParams({
      searchUrl: apiUrl,
      searchParam: communityRdo,
      workType: 'Excel Download',
    });

    return axios
      .get(apiUrl, {
        params: communityRdo,
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: 'comma' });
        },
      })
      .then((response) => OffsetElementList.fromResponse(response.data))
      .catch((response) => apiErrorHelper(response));
  }
}

DataCommunityApi.instance = new DataCommunityApi();
export default DataCommunityApi;
