import { observable, action, computed } from 'mobx';
import { Moment } from 'moment';
import _ from 'lodash';
import Lecture, { getEmptyLecture } from '../model/Lecture';
import { LectureQueryModel } from '../model/LectureQueryModel';
import { CubeCountModel } from '../../../personalcube/model/old/CubeCountModel';
import { InstructorCube } from '../../../cube/cube/model/sdo/InstructorCube';

class LectureStore {
  static instance: LectureStore;

  @observable
  innerLectureList: InstructorCube[] = [];

  @action
  setLectureList(next: InstructorCube[]) {
    this.innerLectureList = next.map((target) => new InstructorCube(target));
  }

  @computed
  get lectureList() {
    return this.innerLectureList;
  }

  @observable
  cubeCount: CubeCountModel = new CubeCountModel();

  @action
  setCubeCount(next: CubeCountModel) {
    this.cubeCount = next;
  }

  @computed
  get selectedCubeCount() {
    return this.cubeCount;
  }

  @observable
  innerSelected: Lecture = getEmptyLecture();

  @action
  select(next: Lecture) {
    this.innerSelected = next;
  }

  @computed
  get selected() {
    return this.innerSelected;
  }

  @observable
  lectureQuery: LectureQueryModel = new LectureQueryModel();

  @action
  clearLectureQuery() {
    this.lectureQuery = new LectureQueryModel();
  }

  @action
  setLectureQuery(query: LectureQueryModel, name: string, value: string | Moment | number | undefined) {
    this.lectureQuery = _.set(query, name, value);
  }

  @computed
  get selectedLectureQuery() {
    return this.lectureQuery;
  }
}

LectureStore.instance = new LectureStore();

export default LectureStore;
