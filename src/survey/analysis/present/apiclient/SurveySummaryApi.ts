import { axiosApi as axios } from 'shared/axios/Axios';
import SurveySummaryModel from '../../model/SurveySummaryModel';

export default class SurveySummaryApi {
  //
  rootURL = '/api/survey/surveySummaries';

  static instance: SurveySummaryApi;

  findSurveySummaryBySurveyCaseIdAndRound(surveyCaseId: string, round: number) {
    return axios
      .get<SurveySummaryModel>(this.rootURL + `/${surveyCaseId}/rounds/${round}`)
      .then((response) => (response && response.data && new SurveySummaryModel(response.data)) || null);
  }
}

Object.defineProperty(SurveySummaryApi, 'instance', {
  value: new SurveySummaryApi(),
  writable: false,
  configurable: false,
});
