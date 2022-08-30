import { axiosApi as axios } from 'shared/axios/Axios';
import DataCubeInstructorModel from 'dataSearch/cubeInstructor/model/DataCubeInstructorModel';
import DataCubeInstructorRdo from 'dataSearch/cubeInstructor/model/DataCubeInstructorRdo';
import { OffsetElementList } from 'shared/model';
import { apiErrorHelper } from 'shared/helper';
import qs from 'qs';
import { setExcelHistoryParams } from 'shared/components/SubActions/sub/ExcelButton/store/ExcelHistoryStore';

class DataCubeInstructorApi {
  URL = '/api/data-search/cube-instructor/excel';
  // URL = '/local/public/cube-instructor/excel';

  static instance: DataCubeInstructorApi;

  /**
   * 컬리지별 학습이력 추출(큐브단위)
   * @Method GET
   * @Param(Body)
   */
  findCubeInstructor(CubeInstructor: DataCubeInstructorRdo): Promise<OffsetElementList<DataCubeInstructorModel>> {
    const apiUrl = `${this.URL}`;

    setExcelHistoryParams({
      searchUrl: apiUrl,
      searchParam: CubeInstructor,
      workType: 'Excel Download'
    })

    return axios
      .get(apiUrl, {
        params: CubeInstructor,
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: 'comma' });
        },
      })
      .then((response) => OffsetElementList.fromResponse(response.data))
      .catch((response) => apiErrorHelper(response));
  }
}

DataCubeInstructorApi.instance = new DataCubeInstructorApi();
export default DataCubeInstructorApi;
