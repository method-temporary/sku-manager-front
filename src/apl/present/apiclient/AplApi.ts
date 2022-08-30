import { axiosApi as axios } from 'shared/axios/Axios';
import { OffsetElementList } from 'shared/model';
import { AplModel } from '../../model/AplModel';
import { AplRdoModel } from '../../model/AplRdoModel';
import { AplListViewModel } from '../../model/AplListViewModel';
import { AplUdoModel } from '../../model/AplUdoModel';
import { setExcelHistoryParams } from 'shared/components/SubActions/sub/ExcelButton/store/ExcelHistoryStore'

export default class AplApi {
  /*
  URL = getApiDomain() + '/api/mytraining/apl';
 */
  //URL = 'http://localhost:8233/apl';

  serverUrl = '/api/learning/apl';
  devUrl =
    process.env.REACT_APP_MY_LEARNING_SUMMARY_API === undefined || process.env.REACT_APP_MY_LEARNING_SUMMARY_API === ''
      ? this.serverUrl
      : process.env.REACT_APP_MY_LEARNING_SUMMARY_API;

  URL =
    process.env.REACT_APP_ENVIRONMENT === undefined || process.env.REACT_APP_ENVIRONMENT === 'server'
      ? this.serverUrl
      : this.devUrl;

  static instance: AplApi;

  findAllAplsByQuery(aplQuery: AplRdoModel) {
    //
    return axios
      .getLoader<OffsetElementList<AplModel>>(this.URL + '/apl-list', {
        params: aplQuery,
      })
      .then(
        (response: any) =>
          (response && response.data && new OffsetElementList<AplModel>(response.data)) || new OffsetElementList()
      );
  }

  findAllAplsExcel(aplQuery: AplRdoModel) {
    const apiUrl = this.URL + '/excel';

    setExcelHistoryParams({
      searchUrl: apiUrl,
      searchParam: JSON.stringify(aplQuery),
      workType: 'Excel Download'
    })

    //
    return axios
      .get<OffsetElementList<AplListViewModel>>(apiUrl, {
        params: aplQuery,
      })
      .then(
        (response: any) =>
          response && response.data && response.data.results.map((apl: AplListViewModel) => new AplListViewModel(apl))
      );
  }

  findApl(aplId: string | undefined) {
    //
    return axios
      .getLoader<AplModel>(this.URL + `/${aplId}`)
      .then((response) => (response && response.data && new AplModel(response.data)) || new AplModel());
  }

  modifyApl(aplUdoModel: AplUdoModel) {
    //
    return axios
      .putLoader<AplModel>(this.URL + `/${aplUdoModel.id}`, aplUdoModel)
      .then((response) => (response && response.data && new AplModel(response.data)) || new AplModel());
  }
}

Object.defineProperty(AplApi, 'instance', {
  value: new AplApi(),
  writable: false,
  configurable: false,
});
