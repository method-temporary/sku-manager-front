import { axiosApi as axios } from 'shared/axios/Axios';
import { OrderedOffset, OffsetElementList } from 'shared/model';
import { DesignState } from '../../model/DesignState';
import { SurveyFormModel } from '../../model/SurveyFormModel';
import SurveyFormFlowCdoModel from '../../model/SurveyFormFlowCdoModel';
import { SurveyFormFlowUdoModel } from '../../model/SurveyFormFlowUdoModel';
import SurveyFormFlowRdoModel from '../../model/SurveyFormFlowRdoModel';

export default class SurveyFormApi {
  URL = '/api/survey/surveyForms';

  static instance: SurveyFormApi;

  findSurveyForms(patronKey: object, orderedOffset: OrderedOffset) {
    return axios
      .get<SurveyFormModel[]>(this.URL, { params: { ...orderedOffset, sortKey: 'time', descending: true } })
      .then((response) => (response && response.data) || null);
  }

  //BasicSearch
  findSurveyFormsByQuery(surveyFormFlowRdo: SurveyFormFlowRdoModel) {
    return axios
      .get<OffsetElementList<SurveyFormModel>>(this.URL + `/searchKey`, { params: surveyFormFlowRdo })
      .then((response) => (response && response.data) || null);
  }

  findSurveyFormsByDesignState(patronKey: object, designState: DesignState, orderedOffset: OrderedOffset) {
    return axios
      .get<SurveyFormModel[]>(this.URL, { params: { ...orderedOffset, designState } })
      .then((response) => (response && response.data) || null);
  }

  findSurveyForm(surveyFormId: string) {
    return axios
      .get<SurveyFormModel>(this.URL + `/${surveyFormId}`)
      .then((response) => (response && response.data) || null);
  }

  countAllSurveyForms() {
    return axios.get<number>(this.URL + '/count').then((response) => response.data);
  }

  countSurveyTitle(title: string | undefined) {
    return axios.post<number>(this.URL + `/countSurveyTitle`, { title }).then((response) => response.data);
  }

  registerSurveyForm(surveyFormFlowCdoModel: SurveyFormFlowCdoModel) {
    return axios
      .post(this.URL + '/flow', surveyFormFlowCdoModel)
      .then((response) => (response && response.data) || null);
  }

  modifySurveyForm(surveyFormId: string, surveyFormFlowUdo: SurveyFormFlowUdoModel) {
    return axios
      .put(this.URL + `/flow/${surveyFormId}`, surveyFormFlowUdo)
      .then((response) => (response && response.data) || null);
  }

  copySurveyForm(surveyFormId: string, surveyFormFlowCdoModel: SurveyFormFlowCdoModel) {
    return axios
      .post(this.URL + `/flow/copy/${surveyFormId}`, surveyFormFlowCdoModel)
      .then((response) => (response && response.data) || null);
  }

  removeSurveyForm(surveyFormId: string) {
    return axios.delete(this.URL + `/flow/${surveyFormId}`).then((response) => (response && response.data) || null);
  }

  findQuestions(surveyFormId: string) {
    return axios.get(`${this.URL}/${surveyFormId}/questions`);
  }

  confirmSurveyForm(surveyFormId: string) {
    return axios.put(`${this.URL}/${surveyFormId}`);
  }

  async arrangeQuestionSequence(surveyFormId: string, questionId: string, targetIndex: number) {
    return axios.put(`${this.URL}/${surveyFormId}/questions/${questionId}/sequence`, { index: targetIndex });
  }
}

Object.defineProperty(SurveyFormApi, 'instance', {
  value: new SurveyFormApi(),
  writable: false,
  configurable: false,
});
