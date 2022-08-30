import { axiosApi as axios } from 'shared/axios/Axios';
import AnswerSheetModel from '../../model/AnswerSheetModel';
import EvaluationSheetExcelRdoModel from '../../model/EvaluationSheetExcelRdoModel';
import { setExcelHistoryParams } from 'shared/components/SubActions/sub/ExcelButton/store/ExcelHistoryStore';

export default class ResponseApi {
  //
  rootURL = '/api/survey/response';

  static instance: ResponseApi;

  openAnswerSheet(surveyCaseId: string, round: number, answerSheet: AnswerSheetModel) {
    return axios
      .post(this.rootURL + `/open/${surveyCaseId}/rounds/${round}`, answerSheet)
      .then((response) => (response && response.data) || null);
  }

  submitAnswerSheet(answerSheetId: string) {
    return axios.put(this.rootURL + `/complete/${answerSheetId}`);
  }

  findEvaluationSheetsBySurveyCaseIdForExcel(surveyCaseId: string) {
    //
    const apiUrl = this.rootURL + `/excel/${surveyCaseId}`;

    setExcelHistoryParams({
      searchUrl: apiUrl,
      searchParam: surveyCaseId,
      workType: 'Excel Download'
    })

    return axios
      .get<EvaluationSheetExcelRdoModel[]>(apiUrl)
      .then((response) => (response && response.data) || []);
  }
}

Object.defineProperty(ResponseApi, 'instance', {
  value: new ResponseApi(),
  writable: false,
  configurable: false,
});
