import { axiosApi as axios } from 'shared/axios/Axios';
import { RollBookModel } from '../../model/RollBookModel';

export default class RollBookApi {
  URL = '/api/lecture/rollbooks';

  static instance: RollBookApi;

  findRollBookByLectureCardIdAndRound(lectureCardId: string, round: number) {
    //
    return axios
      .get<RollBookModel>(this.URL + `/byLectureCardIdAndRound?lectureCardId=${lectureCardId}&round=${round}`)
      .then((response) => (response && response.data) || null);
  }

  findAllLecturesByLectureCardId(lectureCardId: string) {
    //
    return axios
      .get<RollBookModel[]>(this.URL + `/byLectureCardId?lectureCardId=${lectureCardId}`)
      .then((response) => (response && response.data) || null);
  }
}

Object.defineProperty(RollBookApi, 'instance', {
  value: new RollBookApi(),
  writable: false,
  configurable: false,
});
