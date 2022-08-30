import { axiosApi as axios } from 'shared/axios/Axios';

import { OffsetElementList } from 'shared/model';
import { apiErrorHelper } from 'shared/helper';

import DataBadgeRdo from '../../model/DataBadgeRdo';
import { DataBadgeModel } from '../../model/DataBadgeModel';
import qs from 'qs';
import { setExcelHistoryParams } from 'shared/components/SubActions/sub/ExcelButton/store/ExcelHistoryStore';

class DataBadgeApi {
  //
  URL = '/api/data-search/badge-completion/excel';

  static instance: DataBadgeApi;

  /** 회사별 사원 Badge 획득 현황 조회 Api
   * @Method GET
   * @Param(Body) MainPagePopupRdo
   */
  findBadges(badgeRdo: DataBadgeRdo): Promise<OffsetElementList<DataBadgeModel>> {
    //
    const apiUrl = `${this.URL}`;

    setExcelHistoryParams({
      searchUrl: apiUrl,
      searchParam: badgeRdo,
      workType: 'Excel Download'
    })

    return axios
      .get(apiUrl, {
        params: badgeRdo,
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'comma' }),
      })
      .then((response) => OffsetElementList.fromResponse(response.data))
      .catch((response) => apiErrorHelper(response));
  }
}

DataBadgeApi.instance = new DataBadgeApi();
export default DataBadgeApi;
