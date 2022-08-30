import { axiosApi as axios } from 'shared/axios/Axios';
import DataCardPrerequisiteModel from 'dataSearch/cardPrerequisite/model/DataCardPrerequisiteModel';
import DataCardPrerequisiteRdo from 'dataSearch/cardPrerequisite/model/DataCardPrerequisiteRdo';
import { OffsetElementList } from 'shared/model';
import { apiErrorHelper } from 'shared/helper';
import qs from 'qs';
import { setExcelHistoryParams } from 'shared/components/SubActions/sub/ExcelButton/store/ExcelHistoryStore';

class DataCardPrerequisiteApi {
  URL = '/api/data-search/card-prerequisite/excel';
  // URL = '/local/public/card-prerequisite/excel';

  static instance: DataCardPrerequisiteApi;

  /**
   * 컬리지별 학습이력 추출(큐브단위)
   * @Method GET
   * @Param(Body)
   */
  findCardPrerequisite(CardPrerequisite: DataCardPrerequisiteRdo): Promise<OffsetElementList<DataCardPrerequisiteModel>> {
    const apiUrl = `${this.URL}`;

    setExcelHistoryParams({
      searchUrl: apiUrl,
      searchParam: CardPrerequisite,
      workType: 'Excel Download'
    })

    return axios
      .get(apiUrl, {
        params: CardPrerequisite,
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: 'comma' });
        },
      })
      .then((response) => OffsetElementList.fromResponse(response.data))
      .catch((response) => apiErrorHelper(response));
  }
}

DataCardPrerequisiteApi.instance = new DataCardPrerequisiteApi();
export default DataCardPrerequisiteApi;
