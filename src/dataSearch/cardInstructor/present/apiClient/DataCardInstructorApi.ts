import { axiosApi as axios } from 'shared/axios/Axios';
import DataCardInstructorModel from 'dataSearch/cardInstructor/model/DataCardInstructorModel';
import DataCardInstructorRdo from 'dataSearch/cardInstructor/model/DataCardInstructorRdo';
import { OffsetElementList } from 'shared/model';
import { apiErrorHelper } from 'shared/helper';
import qs from 'qs';
import { setExcelHistoryParams } from 'shared/components/SubActions/sub/ExcelButton/store/ExcelHistoryStore';

class DataCardInstructorApi {
  URL = '/api/data-search/card-instructor/excel';
  // URL = '/local/public/card-instructor/excel';

  static instance: DataCardInstructorApi;

  /**
   * 컬리지별 학습이력 추출(큐브단위)
   * @Method GET
   * @Param(Body)
   */
  findCardInstructor(CardInstructor: DataCardInstructorRdo): Promise<OffsetElementList<DataCardInstructorModel>> {
    const apiUrl = `${this.URL}`;

    setExcelHistoryParams({
      searchUrl: apiUrl,
      searchParam: CardInstructor,
      workType: 'Excel Download'
    })

    return axios
      .get(apiUrl, {
        params: CardInstructor,
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: 'comma' });
        },
      })
      .then((response) => OffsetElementList.fromResponse(response.data))
      .catch((response) => apiErrorHelper(response));
  }
}

DataCardInstructorApi.instance = new DataCardInstructorApi();
export default DataCardInstructorApi;
