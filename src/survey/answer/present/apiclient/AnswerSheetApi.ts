import { axiosApi as axios } from 'shared/axios/Axios';
import AnswerSheetModel from '../../model/AnswerSheetModel';
import EvaluationSheetModel from '../../model/EvaluationSheetModel';

export default class AnswerSheetApi {
  //
  rootURL = '/api/survey/answerSheets';

  static instance: AnswerSheetApi;

  findAnswerSheet(surveyCaseId: string, denizenKey: string) {
    return axios
      .get<AnswerSheetModel>(this.rootURL + `/bySurveyCaseId?surveyCaseId=${surveyCaseId}&denizenKey=${denizenKey}`)
      .then((response) => (response && response.data && new AnswerSheetModel(response.data)) || null);
  }

  modifyAnswerSheet(answerSheet: AnswerSheetModel) {
    const nameValues = AnswerSheetModel.getNameValueList(answerSheet);
    return axios
      .put(this.rootURL + `/${answerSheet.id}`, nameValues)
      .then((response) => (response && response.data) || null);
  }

  modifyEvaluationSheet(answerSheetId: string, evaluationSheet: EvaluationSheetModel) {
    const nameValues = EvaluationSheetModel.getNameValueList(evaluationSheet);
    return axios
      .put(this.rootURL + `/${answerSheetId}/evaluationSheet`, nameValues)
      .then((response) => (response && response.data) || null);
  }
}

Object.defineProperty(AnswerSheetApi, 'instance', {
  value: new AnswerSheetApi(),
  writable: false,
  configurable: false,
});
