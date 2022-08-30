import { axiosApi as axios } from 'shared/axios/Axios';
import DataMetaCardModel from 'dataSearch/metaCard/model/DataMetaCardModel';
import DataMetaCardRdo from 'dataSearch/metaCard/model/DataMetaCardRdo';
import { OffsetElementList } from 'shared/model';
import { apiErrorHelper } from 'shared/helper';
import qs from 'qs';
import { setExcelHistoryParams } from 'shared/components/SubActions/sub/ExcelButton/store/ExcelHistoryStore';

class DataMetaCardApi {
  URL = '/api/data-search/card-meta/excel';
  // URL = '/local/public/card-meta/excel';

  static instance: DataMetaCardApi;

  /**
   * 컬리지별 학습이력 추출(큐브단위)
   * @Method GET
   * @Param(Body)
   */
  findMetaCard(LearningCubeRdo: DataMetaCardRdo): Promise<OffsetElementList<DataMetaCardModel>> {
    const apiUrl = `${this.URL}`;

    setExcelHistoryParams({
      searchUrl: apiUrl,
      searchParam: LearningCubeRdo,
      workType: 'Excel Download'
    })

    return axios
      .get(apiUrl, {
        params: LearningCubeRdo,
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: 'comma' });
        },
      })
      .then((response) => OffsetElementList.fromResponse(response.data))
      .catch((response) => apiErrorHelper(response));
  }
}

DataMetaCardApi.instance = new DataMetaCardApi();
export default DataMetaCardApi;
