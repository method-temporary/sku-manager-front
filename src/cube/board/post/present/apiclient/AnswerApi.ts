import { axiosApi as axios, NameValueList } from '@nara.platform/accent';
import { AnswerModel } from '../../model/AnswerModel';

export default class AnswerApi {
  URL = `/api/board/posts/answer`;

  static instance: AnswerApi;

  registerAnswer(answer: AnswerModel) {
    //
    return axios.post<string>(this.URL, answer)
      .then(response => response && response.data || null)
      .catch((reason) => {
        // console.log(reason);
      });
  }

  findAnswerByAnswerId(answerId: string) {
    //
    return axios.get<AnswerModel>(this.URL + `/${answerId}`)
      .then(response => response && response.data || null);
  }

  findAnswerByPostId(postId: string) {
    //
    return axios.get<AnswerModel>(this.URL + `/matched/${postId}`)
      .then(response => response && response.data || null);
  }

  findAllAnswers(offset: number = 0, limit: number = 20) {
    //
    return axios.get<AnswerModel[]>(this.URL + `?offset=${offset}&limit=${limit}`)
      .then(response => response && response.data || null);
  }

  modifyAnswer(answerId: string, nameValues: NameValueList) {
    //
    return axios.put<void>(this.URL + `/${answerId}`, nameValues);
  }

  removeAnswer(answerId: string) {
    //
    return axios.put<void>(this.URL + `/${answerId}`);
  }
}

Object.defineProperty(AnswerApi, 'instance', {
  value: new AnswerApi(),
  writable: false,
  configurable: false,
});
