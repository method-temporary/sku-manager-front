import autobind from 'autobind-decorator';
import { action, observable, runInAction } from 'mobx';
import { ProgramLectureModel } from '../../model/ProgramLectureModel';
import ProgramLectureApi from '../apiclient/ProgramLectureApi';

@autobind
export default class ProgramLectureService {
  //
  static instance: ProgramLectureService;

  programLectureApi: ProgramLectureApi;

  constructor(programLectureApi: ProgramLectureApi) {
    //
    this.programLectureApi = programLectureApi;
  }

  @observable
  programLecture: ProgramLectureModel = {} as ProgramLectureModel;

  @action
  async findProgramLecture(programLectureId: string) {
    //
    const programLecture = await this.programLectureApi.findProgramLecture(programLectureId);
    return runInAction(() => this.programLecture = programLecture);
  }

  @action
  async findProgramLectureByCoursePlanId(coursePlanId: string) {
    //
    const programLecture = await this.programLectureApi.findProgramLectureByCoursePlanId(coursePlanId);
    return runInAction(() => this.programLecture = programLecture);
  }
}


Object.defineProperty(ProgramLectureService, 'instance', {
  value: new ProgramLectureService(ProgramLectureApi.instance),
  writable: false,
  configurable: false,
});
