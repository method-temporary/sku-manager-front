import autobind from 'autobind-decorator';
import { observable, runInAction } from 'mobx';
import CourseLectureApi from '../apiclient/CourseLectureApi';
import { CourseLectureModel } from '../../model/CourseLectureModel';

@autobind
export default class CourseLectureService {
  //
  static instance: CourseLectureService;

  courseLectureApi: CourseLectureApi;

  constructor(courseLectureApi: CourseLectureApi) {
    //
    this.courseLectureApi = courseLectureApi;
  }

  @observable
  courseLecture: CourseLectureModel = {} as CourseLectureModel;

  async findCourseLectureByCoursePlanId(coursePlanId: string) {
    // console.log('2-1 2222222222222222222222222222222222222222222222222');
    // console.log('coursePlanId', coursePlanId);
    const courseLecture = await this.courseLectureApi.findCourseLectureByCoursePlanId(
      coursePlanId
    );
    // console.log('2-2 2222222222222222222222222222222222222222222222222');
    // console.log('courseLecture', courseLecture);
    return runInAction(() => (this.courseLecture = courseLecture));
  }
}

Object.defineProperty(CourseLectureService, 'instance', {
  value: new CourseLectureService(CourseLectureApi.instance),
  writable: false,
  configurable: false,
});
