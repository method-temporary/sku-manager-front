import { axiosApi as axios } from 'shared/axios/Axios';

export default class ScheduleApi {
  //
  URL = '/api/survey/publishing';

  static instance: ScheduleApi;

  openSurvey(surveyCaseId: string, round: number) {
    return axios.put(this.URL + `/${surveyCaseId}/rounds/${round}/open`);
  }

  cancelSurvey(surveyCaseId: string, round: number) {
    return axios.put(this.URL + `/${surveyCaseId}/rounds/${round}/cancel`);
  }
}

Object.defineProperty(ScheduleApi, 'instance', {
  value: new ScheduleApi(),
  writable: false,
  configurable: false,
});
