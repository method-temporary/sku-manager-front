import qs from 'qs';

import { axiosApi as axios, getAxiosErrorXMessage } from 'shared/axios/Axios';
import { setExcelHistoryParams } from 'shared/components/SubActions/sub/ExcelButton/store/ExcelHistoryStore';
import { OffsetElementList } from 'shared/model';

import { InstructorSdo } from '_data/user/instructors/model/InstructorSdo';

import { InstructorWithUserIdentity } from '../../model/InstructorWithUserIdentity';
import { InstructorCdo } from '../../model/InstructorCdo';

class InstructorApi {
  ADMIN_URL = '/api/user/admin/';

  static instance: InstructorApi;

  findInstructorsById(instructorId: string): Promise<InstructorWithUserIdentity> {
    //
    return axios
      .getLoader(this.ADMIN_URL + `instructors/${instructorId}`)
      .then((response) => response && response.data);
  }

  findInstructors(instructorSdo: InstructorSdo): Promise<OffsetElementList<InstructorWithUserIdentity>> {
    //
    return axios
      .getLoader(this.ADMIN_URL + `instructors`, { params: instructorSdo })
      .then((response) => OffsetElementList.fromResponse(response.data));
  }

  findAllInstructors(instructorSdo: InstructorSdo): Promise<OffsetElementList<InstructorWithUserIdentity>> {
    const apiUrl = this.ADMIN_URL + `instructors`;

    setExcelHistoryParams({
      searchUrl: apiUrl,
      searchParam: instructorSdo,
      workType: 'Excel Download',
    });

    return axios
      .get(apiUrl, { params: instructorSdo })
      .then((response) => OffsetElementList.fromResponse(response.data));
  }

  findAllInstructorsForExcel(instructorSdo: InstructorSdo): Promise<OffsetElementList<InstructorWithUserIdentity>> {
    const apiUrl = this.ADMIN_URL + `instructors/forExcel`;

    setExcelHistoryParams({
      searchUrl: apiUrl,
      searchParam: instructorSdo,
      workType: 'Excel Download',
    });

    return axios
      .get(apiUrl, { params: instructorSdo })
      .then((response) => OffsetElementList.fromResponse(response.data));
  }

  findInstructorsByIds(instructorIds: string[]): Promise<InstructorWithUserIdentity[]> {
    //
    return axios
      .get(this.ADMIN_URL + `instructors/byIds?instructorIds=${instructorIds}`, {
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'comma' }),
      })
      .then((response) => response && response.data);
  }

  findInstructorByEmail(email: string): Promise<InstructorWithUserIdentity> {
    //
    return axios
      .get(this.ADMIN_URL + `instructors/byEmail?email=${email}`)
      .then((response) => response && response.data);
  }

  registerInstructor(instructorCdo: InstructorCdo): Promise<string> {
    //
    return axios
      .postLoader(this.ADMIN_URL + `instructors`, instructorCdo)
      .then((response) => response && response.data)
      .catch((error) => getAxiosErrorXMessage(error));
  }

  modifyInstructor(instructorId: string, instructorCdo: InstructorCdo) {
    //
    return axios
      .putLoader(this.ADMIN_URL + `instructors/${instructorId}`, instructorCdo)
      .then((response) => response && response.data)
      .catch((error) => getAxiosErrorXMessage(error));
  }

  removeInstructor(instructorId: string) {
    //
    return axios
      .deleteLoader(this.ADMIN_URL + `instructors/${instructorId}`)
      .then((response) => response && response.data);
  }

  accountInstructor(instructorId: string, password: string) {
    //
    return axios
      .putLoader(this.ADMIN_URL + `instructors/${instructorId}/createAccount`, password)
      .then((response) => response && response.data);
  }
}

InstructorApi.instance = new InstructorApi();
export default InstructorApi;
