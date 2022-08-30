import { axiosApi as axios, OffsetElementList } from '@nara.platform/accent';
import { ClassroomGroupModel } from '../../model/sdo/ClassroomGroupModel';
import { ClassroomModel } from 'cube/classroom';

export default class ClassroomGroupApi {
  //
  classroomURL = '/api/cube/classrooms';
  classroomGroupURL = '/api/cube/classroomgroups';

  static instance: ClassroomGroupApi;

  findClassroom(classroomId: string) {
    //
    return axios
      .get<ClassroomModel>(this.classroomURL + `/${classroomId}`)
      .then((response) => (response && response.data) || null);
  }

  findClassrooms(classroomIds: string[]) {
    //
    return axios
      .post<OffsetElementList<ClassroomModel>>(this.classroomURL + `/classroomIds`, classroomIds)
      .then((response) => (response && response.data) || null);
  }

  findClassroomGroup(classroomGroupId: string) {
    //
    return axios
      .get<ClassroomGroupModel>(this.classroomGroupURL + `/${classroomGroupId}`)
      .then((response) => (response && response.data) || null);
  }
}

Object.defineProperty(ClassroomGroupApi, 'instance', {
  value: new ClassroomGroupApi(),
  writable: false,
  configurable: false,
});
