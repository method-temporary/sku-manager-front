import { axiosApi as axios } from 'shared/axios/Axios';
import DataMetaCubeModel from 'dataSearch/metaCube/model/DataMetaCubeModel';
import DataMetaCubeRdo from 'dataSearch/metaCube/model/DataMetaCubeRdo';
import { OffsetElementList } from 'shared/model';
import { apiErrorHelper } from 'shared/helper';
import qs from 'qs';
import { setExcelHistoryParams } from 'shared/components/SubActions/sub/ExcelButton/store/ExcelHistoryStore';

class DataMetaCubeApi {
  URL = '/api/data-search/cube-meta/excel';
  // URL = '/local/public/cube-meta/excel';

  static instance: DataMetaCubeApi;

  /**
   * 컬리지별 학습이력 추출(큐브단위)
   * @Method GET
   * @Param(Body)
   */
  findMetaCube(LearningCubeRdo: DataMetaCubeRdo): Promise<OffsetElementList<DataMetaCubeModel>> {
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

DataMetaCubeApi.instance = new DataMetaCubeApi();
export default DataMetaCubeApi;
