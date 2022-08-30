import { axiosApi as axios } from 'shared/axios/Axios';
import { NameValueList } from 'shared/model';

import { AnswerFlowCdoModel } from '../../model/AnswerFlowCdoModel';

export default class AnswerFlowApi {
  URL = `/api/board/posts/answer/flow`;

  static instance: AnswerFlowApi;

  createAnswer(answerFlowCdo: AnswerFlowCdoModel) {
    return axios.post<string>(this.URL, answerFlowCdo).then((response) => (response && response.data) || null);
  }

  updateAnswer(answerId: string, nameValues: NameValueList) {
    //
    return axios.put<void>(this.URL + `/${answerId}`, nameValues);
  }
}

Object.defineProperty(AnswerFlowApi, 'instance', {
  value: new AnswerFlowApi(),
  writable: false,
  configurable: false,
});
