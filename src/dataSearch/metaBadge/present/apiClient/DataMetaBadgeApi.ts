import { axiosApi as axios } from 'shared/axios/Axios';
import DataMetaBadgeModel from 'dataSearch/metaBadge/model/DataMetaBadgeModel';
import DataMetaBadgeRdo from 'dataSearch/metaBadge/model/DataMetaBadgeRdo';
import { apiErrorHelper } from 'shared/helper';
import { OffsetElementList } from 'shared/model';
import qs from 'qs';
import { setExcelHistoryParams } from 'shared/components/SubActions/sub/ExcelButton/store/ExcelHistoryStore';

class DataMetaBadgeApi {
  URL = '/api/data-search/meta-badge/excel';

  static instance: DataMetaBadgeApi;

  /**
   * 메타 정보 추출(뱃지)
   * @Method GET
   * @Param(Body)
   */
  findMetaBadge(badgeRdo: DataMetaBadgeRdo): Promise<OffsetElementList<DataMetaBadgeModel>> {
    const apiUrl = `${this.URL}`;

    setExcelHistoryParams({
      searchUrl: apiUrl,
      searchParam: badgeRdo,
      workType: 'Excel Download'
    })

    return axios
      .get(apiUrl, {
        params: badgeRdo,
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: 'comma' });
        },
      })
      .then((response) => OffsetElementList.fromResponse(response.data))
      .catch((response) => apiErrorHelper(response));
  }
}

DataMetaBadgeApi.instance = new DataMetaBadgeApi();
export default DataMetaBadgeApi;
