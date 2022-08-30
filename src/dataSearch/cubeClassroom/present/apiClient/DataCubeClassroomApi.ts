import { axiosApi as axios } from 'shared/axios/Axios';
import DataCubeClassroomModel from 'dataSearch/cubeClassroom/model/DataCubeClassroomModel';
import DataCubeClassroomRdo from 'dataSearch/cubeClassroom/model/DataCubeClassroomRdo';
import { OffsetElementList } from 'shared/model';
import { apiErrorHelper } from 'shared/helper';
import qs from 'qs';
import { setExcelHistoryParams } from 'shared/components/SubActions/sub/ExcelButton/store/ExcelHistoryStore';

class DataCubeClassroomApi {
  URL = '/api/data-search/cube-classroom/excel';
  // URL = '/local/public/cube-classroom/excel';

  static instance: DataCubeClassroomApi;

  /**
   * 컬리지별 학습이력 추출(큐브단위)
   * @Method GET
   * @Param(Body)
   */
  findCubeClassroom(LearningCubeRdo: DataCubeClassroomRdo): Promise<OffsetElementList<DataCubeClassroomModel>> {
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

DataCubeClassroomApi.instance = new DataCubeClassroomApi();
export default DataCubeClassroomApi;
