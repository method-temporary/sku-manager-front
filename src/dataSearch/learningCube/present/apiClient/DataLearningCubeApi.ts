import { axiosApi as axios } from 'shared/axios/Axios';
import DataLearningCubeModel from 'dataSearch/learningCube/model/DataLearningCubeModel';
import DataLearningCubeRdo from 'dataSearch/learningCube/model/DataLearningCubeRdo';
import { OffsetElementList } from 'shared/model';
import { apiErrorHelper } from 'shared/helper';
import qs from 'qs';
import { setExcelHistoryParams } from 'shared/components/SubActions/sub/ExcelButton/store/ExcelHistoryStore';

class DataLearningCubeApi {
  URL = '/api/data-search/cube-learning-info/excel';

  static instance: DataLearningCubeApi;

  /**
   * 컬리지별 학습이력 추출(큐브단위)
   * @Method GET
   * @Param(Body)
   */
  findLearningCube(LearningCubeRdo: DataLearningCubeRdo): Promise<OffsetElementList<DataLearningCubeModel>> {
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

DataLearningCubeApi.instance = new DataLearningCubeApi();
export default DataLearningCubeApi;
