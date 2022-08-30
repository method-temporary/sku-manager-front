import { axiosApi as axios } from 'shared/axios/Axios';
import { TrainingCountModel } from '../../model/TrainingCountModel';

import { TrainingListViewModel } from '../../model/TrainingListViewModel';
import { TrainingRdo } from '../../model/TrainingRdo';
import { OffsetElementList } from 'shared/model';
import qs from 'qs';
import { TrainingForCardListViewModel } from '../../model/TrainingForCardListViewModel';
import { setExcelHistoryParams } from 'shared/components/SubActions/sub/ExcelButton/store/ExcelHistoryStore'

class TrainingApi {
  //
  URL = '/api/lecture/students';

  static instance: TrainingApi;

  //Manager, SuprManager : SearchKey 검색
  findAllTrainingsBySearchKey(trainingRdo: TrainingRdo): Promise<OffsetElementList<TrainingListViewModel>> {
    const apiUrl = this.URL + `/admin/findUserStudents`;

    setExcelHistoryParams({
      searchUrl: apiUrl,
      searchParam: trainingRdo,
      workType: 'Excel Download'
    })


    return axios
      .getLoader(apiUrl, {
        params: trainingRdo,
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'comma' }),
      })
      .then((response) => OffsetElementList.fromResponse(response.data));
  }

  findAllTrainingCountBySearchKey(trainingRdo: TrainingRdo): Promise<TrainingCountModel> {
    return axios
      .get(this.URL + `/count`, {
        params: trainingRdo,
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'comma' }),
      })
      .then((response) => response && response.data);
  }

  findAllTrainingForCard(profileId: string, cardId: string): Promise<TrainingForCardListViewModel> {
    //
    return axios
      .get(this.URL + `/admin/userCardRelatedStudents/${profileId}/${cardId}`)
      .then((response) => response && response.data);
  }
}

TrainingApi.instance = new TrainingApi();
export default TrainingApi;
