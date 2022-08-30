import { axiosApi as axios } from 'shared/axios/Axios';
import { ProgramLectureModel } from '../../model/ProgramLectureModel';

export default class ProgramLectureApi {
  //
  URL = '/api/lecture/programLectures';

  static instance: ProgramLectureApi;

  findProgramLecture(programLectureId: string) {
    //
    return axios
      .get<ProgramLectureModel>(this.URL + `/${programLectureId}`)
      .then((response) => (response && response.data) || null);
  }

  findProgramLectureByCoursePlanId(coursePlanId: string) {
    //
    return axios
      .get<ProgramLectureModel>(this.URL + `/find/${coursePlanId}`)
      .then((response) => (response && response.data) || null);
  }
}

Object.defineProperty(ProgramLectureApi, 'instance', {
  value: new ProgramLectureApi(),
  writable: false,
  configurable: false,
});
