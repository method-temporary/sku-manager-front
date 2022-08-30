import { axiosApi as axios } from 'shared/axios/Axios';

export default class ClassroomGroupFlowApi {
  //
  URL = '/api/cube/classroomgroups/flow';

  static instance: ClassroomGroupFlowApi;

  // Api
  // makeClassroomGroup(classroomGroup: ClassroomGroupFlowCdoModel) {
  //   //
  //   return axios.post<string>(this.URL, classroomGroup).then((response) => (response && response.data) || null);
  // }
  //
  // modSuperClassroom(cubeId: string, classroomGroupFlowUdoModel: ClassroomGroupFlowUdoModel) {
  //   return axios.put<void>(this.URL + `/approved/${cubeId}`, classroomGroupFlowUdoModel);
  // }
  //
  // modifyClassroomGroup(cubeId: string, classroomGroupFlowUdoModel: ClassroomGroupFlowUdoModel) {
  //   //
  //   return axios.put<void>(this.URL + `/${cubeId}`, classroomGroupFlowUdoModel);
  // }
  //
  // makeClassroomGroupByUserVer(classroomGroupFlowUserCdo: ClassroomGroupFlowUserCdo) {
  //   //
  //   return axios.put<void>(this.URL + `/byUser`, classroomGroupFlowUserCdo);
  // }

  removeClassroomGroup(cubeId: string) {
    //
    return axios.delete(this.URL + `/${cubeId}`);
  }
}

Object.defineProperty(ClassroomGroupFlowApi, 'instance', {
  value: new ClassroomGroupFlowApi(),
  writable: false,
  configurable: false,
});
