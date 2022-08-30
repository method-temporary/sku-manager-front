import { axiosApi as axios } from 'shared/axios/Axios';
import DataCardPermittedModel from 'dataSearch/cardPermitted/model/DataCardPermittedModel';
import DataCardPermittedRdo from 'dataSearch/cardPermitted/model/DataCardPermittedRdo';
import { OffsetElementList } from 'shared/model';
import { apiErrorHelper } from 'shared/helper';
import qs from 'qs';
import { setExcelHistoryParams } from 'shared/components/SubActions/sub/ExcelButton/store/ExcelHistoryStore';

class DataCardPermittedApi {
  URL = '/api/data-search/card-permitted/excel';
  // URL = '/local/public/card-permitted/excel';

  static instance: DataCardPermittedApi;

  /**
   * 컬리지별 학습이력 추출(큐브단위)
   * @Method GET
   * @Param(Body)
   */
  findCardPermitted(CardPermitted: DataCardPermittedRdo): Promise<OffsetElementList<DataCardPermittedModel>> {
    const apiUrl = `${this.URL}`;

    setExcelHistoryParams({
      searchUrl: apiUrl,
      searchParam: CardPermitted,
      workType: 'Excel Download'
    })

    return axios
      .get(apiUrl, {
        params: CardPermitted,
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: 'comma' });
        },
      })
      .then((response) => OffsetElementList.fromResponse(response.data))
      .catch((response) => apiErrorHelper(response));
  }
}

DataCardPermittedApi.instance = new DataCardPermittedApi();
export default DataCardPermittedApi;
