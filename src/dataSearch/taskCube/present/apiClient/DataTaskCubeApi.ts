import { axiosApi as axios } from 'shared/axios/Axios';
import DataTaskCubeModel from 'dataSearch/taskCube/model/DataTaskCubeModel';
import DataTaskCubeRdo from 'dataSearch/taskCube/model/DataTaskCubeRdo';
import { OffsetElementList } from 'shared/model';
import { apiErrorHelper } from 'shared/helper';
import qs from 'qs';
import { setExcelHistoryParams } from 'shared/components/SubActions/sub/ExcelButton/store/ExcelHistoryStore';

class DataTaskCubeApi {
  URL = '/api/data-search/task-cube/excel';
  // URL = '/local/public/task-cube/excel';

  static instance: DataTaskCubeApi;

  /**
   * 컬리지별 학습이력 추출(큐브단위)
   * @Method GET
   * @Param(Body)
   */
  findTaskCube(LearningCubeRdo: DataTaskCubeRdo): Promise<OffsetElementList<DataTaskCubeModel>> {
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

DataTaskCubeApi.instance = new DataTaskCubeApi();
export default DataTaskCubeApi;
