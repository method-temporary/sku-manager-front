import { axiosApi as axios } from 'shared/axios/Axios';

import { OffsetElementList } from 'shared/model';
import { apiErrorHelper } from 'shared/helper';

import DataFavoritesRdo from '../../model/DataFavoritesRdo';
import { DataFavoritesModel } from '../../model/DataFavoritesModel';
import qs from 'qs';
import { setExcelHistoryParams } from 'shared/components/SubActions/sub/ExcelButton/store/ExcelHistoryStore';

class DataFavoritesApi {
  URL = '/api/data-search/favorites/excel';
  // URL = '/local/public/favorites/excel';

  static instance: DataFavoritesApi;

  /** 채널별 관심자 추출 Api
   * @Method GET
   * @Param(Body) DataFavoritesRdo
   */
  findChannel(Rdo: DataFavoritesRdo): Promise<OffsetElementList<DataFavoritesModel>> {
    //
    const apiUrl = `${this.URL}`;

    setExcelHistoryParams({
      searchUrl: apiUrl,
      searchParam: Rdo,
      workType: 'Excel Download'
    })

    return axios
      .get(apiUrl, {
        params: Rdo,
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: 'comma' });
        },
      })
      .then((response) => OffsetElementList.fromResponse(response.data))
      .catch((response) => apiErrorHelper(response));
  }
}

DataFavoritesApi.instance = new DataFavoritesApi();
export default DataFavoritesApi;
