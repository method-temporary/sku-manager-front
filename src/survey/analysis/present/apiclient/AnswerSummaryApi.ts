import { axiosApi as axios } from 'shared/axios/Axios';
import AnswerSummaryModel from '../../model/AnswerSummaryModel';

export default class AnswerSummaryApi {
  //
  rootURL = '/api/survey/answerSummaries';

  static instance: AnswerSummaryApi;

  findAnswerSummariesBySurveySummaryId(surveySummaryId: string) {
    return axios
      .get<AnswerSummaryModel[]>(this.rootURL, { params: { surveySummaryId } })
      .then((response) => (response && response.data) || []);
  }
}

Object.defineProperty(AnswerSummaryApi, 'instance', {
  value: new AnswerSummaryApi(),
  writable: false,
  configurable: false,
});
