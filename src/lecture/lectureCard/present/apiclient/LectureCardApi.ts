import { axiosApi as axios, NameValueList } from '@nara.platform/accent';
import { IdName } from 'shared/model';

import { LectureCardCdoModel } from '../../model/LectureCardCdoModel';
import { LectureCardModel } from '../../model/LectureCardModel';

export default class LectureCardApi {
  URL = '/api/lecture/lectureCards';

  static instance: LectureCardApi;

  registerLectureCard(lectureCardCdo: LectureCardCdoModel) {
    //
    return axios.post<string>(this.URL, lectureCardCdo).then((response) => (response && response.data) || null);
  }

  findLectureCard(lectureCardId: string) {
    //
    return axios
      .get<LectureCardModel>(this.URL + `/${lectureCardId}`)
      .then((response) => (response && response.data) || null);
  }

  findLectureCardByLearningCardId(learningCard: string) {
    //
    return axios
      .get<LectureCardModel>(this.URL + `/byLearningCardId?learningCardId=${learningCard}`)
      .then((response) => (response && response.data) || null);
  }

  findAllLectureCards(offset: number, limit: number) {
    //
    return axios
      .get<LectureCardModel[]>(this.URL + `?offset=${offset}&limit${limit}`)
      .then((response) => (response && response.data) || null);
  }

  modifyLectureCard(lectureCardId: string, nameValues: NameValueList) {
    //
    return axios.get<void>(this.URL + `/${lectureCardId}`, { params: nameValues });
  }

  findLectureCardByCubeId(cubeId: string) {
    //
    return axios
      .get<LectureCardModel>(this.URL + `/byCubeId?cubeId=${cubeId}`)
      .then((response) => (response && response.data) || null);
  }

  findLectureCardIdName(lectureCardUsids: string[]) {
    //
    return axios
      .get<IdName[]>(this.URL + `/lectureIdName?lectureCardUsids=${lectureCardUsids}`)
      .then((response) => (response && response.data) || null);
  }
}

Object.defineProperty(LectureCardApi, 'instance', {
  value: new LectureCardApi(),
  writable: false,
  configurable: false,
});
