import { WorkBook } from 'xlsx/types';

import { axiosApi as axios } from '@nara.platform/accent';

import { OffsetElementList } from 'shared/model';
import { getApiDomain } from 'shared/helper';
import { setExcelHistoryParams } from 'shared/components/SubActions/sub/ExcelButton/store/ExcelHistoryStore';
import { BadgeStudentModel } from '../../model/BadgeStudentModel';
import { BadgeStudentRdoModel } from '../../model/BadgeStudentRdoModel';
import { BadgeStudentCountRdoModel } from '../../model/BadgeStudentCountRdoModel';

export default class BadgeStudentApi {
  URL = getApiDomain() + '/api/badge/badgeStudents';

  static instance: BadgeStudentApi;

  //
  findStudent(studentId: string) {
    //
    return axios
      .get<BadgeStudentModel>(this.URL + `?id=${studentId}`)
      .then((response) => (response && response.data) || null);
  }

  findAllStudents(studentRdo: BadgeStudentRdoModel): Promise<OffsetElementList<BadgeStudentModel>> {
    //
    const apiUrl = this.URL + `/byRdo`;

    setExcelHistoryParams({
      searchUrl: apiUrl,
      searchParam: studentRdo,
      workType: 'Excel Download',
    });

    return axios
      .get<OffsetElementList<BadgeStudentModel>>(apiUrl, {
        params: studentRdo,
      })
      .then((response) => (response && response.data) || null);
  }

  excelWrite(studentRdo: BadgeStudentRdoModel) {
    //
    return axios.get<WorkBook>(this.URL + `/students/download`, {
      params: studentRdo,
    });
  }

  findStudentCount(badgeId: string) {
    //
    return axios
      .get<BadgeStudentCountRdoModel>(this.URL + `/count/${badgeId}`)
      .then((response) => (response && response.data) || null);
  }

  studentMissionCompletedRequest(id: string) {
    return axios.put<void>(this.URL + `/Passed?badgeStudentId=${id}`);
  }

  studentMissionFailedRequest(id: string) {
    //
    return axios.put(this.URL + `/Failed?badgeStudentId=${id}`).then((response) => response && response.data);
  }

  issuedBadgeIssueState(BadgeStudentsIds: string[]) {
    //
    return axios.put<void>(this.URL + '/issued', BadgeStudentsIds);
  }

  canceledBadgeIssueState(BadgeStudentsIds: string[]) {
    //
    return axios.put<void>(this.URL + '/canceled', BadgeStudentsIds);
  }

  deleteUserBadge(badgeStudentIds: string[]) {
    //

    return axios.delete(`${this.URL}`, { data: badgeStudentIds }).then((response) => response && response.data);
  }
}

Object.defineProperty(BadgeStudentApi, 'instance', {
  value: new BadgeStudentApi(),
  writable: false,
  configurable: false,
});
