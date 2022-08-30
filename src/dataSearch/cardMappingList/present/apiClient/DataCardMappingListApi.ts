import { axiosApi as axios } from 'shared/axios/Axios';
import DataCardMappingListModel from 'dataSearch/cardMappingList/model/DataCardMappingListModel';
import DataCardMappingListRdo from 'dataSearch/cardMappingList/model/DataCardMappingListRdo';
import { OffsetElementList } from 'shared/model';
import { apiErrorHelper } from 'shared/helper';
import qs from 'qs';
import { setExcelHistoryParams } from 'shared/components/SubActions/sub/ExcelButton/store/ExcelHistoryStore';

class DataCardMappingListApi {
  URL = '/api/data-search/card-mapping-list/excel';
  // URL = '/local/public/card-mapping-list/excel';

  static instance: DataCardMappingListApi;

  /**
   * 컬리지별 학습이력 추출(큐브단위)
   * @Method GET
   * @Param(Body)
   */
  findCardMappingList(LearningCubeRdo: DataCardMappingListRdo): Promise<OffsetElementList<DataCardMappingListModel>> {
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

DataCardMappingListApi.instance = new DataCardMappingListApi();
export default DataCardMappingListApi;
