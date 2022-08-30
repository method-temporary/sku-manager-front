import { axiosApi as axios } from 'shared/axios/Axios';
import { CourseLectureModel } from '../../model/CourseLectureModel';

export default class CourseLectureApi {
  //
  URL = '/api/lecture/courseLectures';

  static instance: CourseLectureApi;

  findCourseLectureByCoursePlanId(coursePlanId: string) {
    //
    return axios
      .get<CourseLectureModel>(this.URL + `/find/${coursePlanId}`)
      .then((response) => (response && response.data) || null);
  }
}

Object.defineProperty(CourseLectureApi, 'instance', {
  value: new CourseLectureApi(),
  writable: false,
  configurable: false,
});
