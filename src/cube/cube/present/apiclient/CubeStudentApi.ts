import { axiosApi as axios } from 'shared/axios/Axios';
import { OffsetElementList } from 'shared/model';
import StudentCount from '../../../../card/student/model/vo/StudentCount';
import qs from 'qs';
import { StudentLearningStateUdo } from '../../../../card/student/model/vo/StudentLearningStateUdo';
import { StudentSendEmail } from '../../../../card/student/model/vo/StudentSendEmail';
import { StudentModel } from 'student/model/StudentModel';
import StudentByCubeRdo from 'student/model/StudentByCubeRdo';
import StudentCountRdo from 'student/model/vo/StudentCountRdo';
import { StudentAcceptOrRejectUdo } from '../../../../student/model/vo/StudentAcceptOrRejectUdo';
import { StudentWithUserIdentity } from '../../../../student/model/StudentWithUserIdentity';
import { setExcelHistoryParams } from 'shared/components/SubActions/sub/ExcelButton/store/ExcelHistoryStore';

export default class CubeStudentApi {
  URL = '/api/lecture/students';

  static instance: CubeStudentApi;

  countStudent(studentCountRdo: StudentCountRdo): Promise<StudentCount> {
    //
    return axios
      .get(this.URL + `/count`, {
        params: studentCountRdo,
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'comma' }),
      })
      .then((response) => (response && response.data) || null);
  }

  findStudentByCubeRdo(studentByCubeRdo: StudentByCubeRdo): Promise<OffsetElementList<StudentModel>> {
    //
    return axios
      .get(this.URL + `/admin/findCubeStudentByCubeStudentRdo`, {
        params: studentByCubeRdo,
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'comma' }),
      })
      .then((response) => OffsetElementList.fromResponse(response.data));
  }

  findCubeStudentByCubeStudentRdo(
    studentByCubeRdo: StudentByCubeRdo
  ): Promise<OffsetElementList<StudentWithUserIdentity>> {
    //
    return axios
      .getLoader(this.URL + `/admin/findCubeStudentByCubeStudentRdo`, {
        params: studentByCubeRdo,
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'comma' }),
      })
      .then((response) => OffsetElementList.fromResponse(response.data));
  }

  findCubeStudentByCubeStudentRdoForExcel(
    studentByCubeRdo: StudentByCubeRdo
  ): Promise<OffsetElementList<StudentWithUserIdentity>> {
    //
    const apiUrl = this.URL + `/admin/findCubeStudentByCubeStudentRdoForExcel`;

    setExcelHistoryParams({
      searchUrl: apiUrl,
      searchParam: studentByCubeRdo,
      workType: 'Excel Download'
    })

    return axios
      .get(apiUrl, {
        params: studentByCubeRdo,
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'comma' }),
      })
      .then((response) => OffsetElementList.fromResponse(response.data));
  }

  modifyStudentLearningState(studentLearningStateUdo: StudentLearningStateUdo): Promise<void> {
    //
    return axios
      .putLoader(this.URL + `/admin/modifyStudentLearningState`, studentLearningStateUdo)
      .then((response) => (response && response.data) || null);
  }

  deletedByIds(ids: string[]): Promise<void> {
    //
    return axios.deleteLoader(this.URL + `?ids=${ids}`).then((response) => (response && response.data) || null);
  }

  sendEmailForAdmin(studentSendEmail: StudentSendEmail): Promise<void> {
    //
    return axios
      .postLoader(this.URL + '/admin/sendEmail', studentSendEmail)
      .then((response) => (response && response.data) || null);
  }

  accept(studentAcceptOrRejectUdo: StudentAcceptOrRejectUdo): Promise<void> {
    return axios
      .putLoader(this.URL + `/accept`, studentAcceptOrRejectUdo)
      .then((response) => (response && response.data) || null);
  }

  reject(studentAcceptOrRejectUdo: StudentAcceptOrRejectUdo): Promise<void> {
    return axios
      .putLoader(this.URL + `/reject`, studentAcceptOrRejectUdo)
      .then((response) => (response && response.data) || null);
  }
}

Object.defineProperty(CubeStudentApi, 'instance', {
  value: new CubeStudentApi(),
  writable: false,
  configurable: false,
});
