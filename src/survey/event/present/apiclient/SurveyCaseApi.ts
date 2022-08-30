import { axiosApi as axios } from 'shared/axios/Axios';
import { OrderedOffset } from 'shared/model';
import SurveyCaseModel from '../../model/SurveyCaseModel';
import RoundPartModel from '../../model/RoundPartModel';
import SurveyCaseCriteriaModel from '../../model/SurveyCaseCriteriaModel';

export default class SurveyCaseApi {
  //
  URL = '/api/survey/surveyCases';

  static instance: SurveyCaseApi;

  findSurveyCases(orderedOffset: OrderedOffset) {
    return axios
      .get<SurveyCaseModel[]>(this.URL, { params: { orderedOffset } })
      .then((response) => (response && response.data) || null);
  }

  findSurveyCasesByCriteria(criteria: SurveyCaseCriteriaModel, orderedOffset: OrderedOffset) {
    return axios
      .get<SurveyCaseModel[]>(this.URL, { params: { criteria, orderedOffset } })
      .then((response) => (response && response.data) || null);
  }

  countAllSurveyCases() {
    return axios.get(this.URL + '/count').then((response) => response && response.data);
  }

  findSurveyCase(surveyCaseId: string) {
    return axios.get<SurveyCaseModel>(this.URL + `/${surveyCaseId}`).then(({ data }) => data);
  }

  findSurveyCaseByFeedId(surveyCaseId: string) {
    //return axios.get<SurveyCaseModel>(this.URL + `/${surveyCaseId}`).then((response) => response && response.data);
    return axios.get(this.URL + `/${surveyCaseId}`).then((response) => response && response.data);
  }

  registerSurveyCase(surveyCaseCdo: any) {
    return axios.post(this.URL, surveyCaseCdo).then((response) => (response && response.data) || null);
  }

  modifySurveyCase(surveyCase: SurveyCaseModel) {
    const nameValues = SurveyCaseModel.getNameValueList(surveyCase);
    return axios.put(this.URL + `/${surveyCase.id}`, nameValues);
  }

  modifyRoundPart(roundPart: RoundPartModel) {
    const nameValues = RoundPartModel.getNameValueList(roundPart);
    return axios.put(this.URL + `/${roundPart.surveyCaseId}/rounds/${roundPart.round}`, nameValues);
  }
}

Object.defineProperty(SurveyCaseApi, 'instance', {
  value: new SurveyCaseApi(),
  writable: false,
  configurable: false,
});
