import { axiosApi as axios } from 'shared/axios/Axios';

import { OffsetElementList } from 'shared/model';
import { apiErrorHelper } from 'shared/helper';

import DataChannelRdo from '../../model/DataChannelRdo';
import { DataChannelModel } from '../../model/DataChannelModel';
import qs from 'qs';
import { setExcelHistoryParams } from 'shared/components/SubActions/sub/ExcelButton/store/ExcelHistoryStore';

class DataChannelApi {
  //
  URL = '/api/data-search/channel-interest/excel';
  // URL = '/local/public/channel-interest/excel';

  static instance: DataChannelApi;

  /** 채널별 관심자 추출 Api
   * @Method GET
   * @Param(Body) DataFavoritesRdo
   */
  findChannel(channelRdo: DataChannelRdo): Promise<OffsetElementList<DataChannelModel>> {
    //
    const apiUrl = `${this.URL}`;

    setExcelHistoryParams({
      searchUrl: apiUrl,
      searchParam: channelRdo,
      workType: 'Excel Download'
    })

    return axios
      .get(apiUrl, {
        params: channelRdo,
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: 'comma' });
        },
      })
      .then((response) => OffsetElementList.fromResponse(response.data))
      .catch((response) => apiErrorHelper(response));
  }
}

DataChannelApi.instance = new DataChannelApi();
export default DataChannelApi;
