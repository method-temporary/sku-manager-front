import { axiosApi as axios } from 'shared/axios/Axios';
import { getApiDomain } from 'shared/helper';

import { BadgeMissionMailRequestCdoModel } from '../../model/BadgeMissionMailRequestCdoModel';
import { BadgeIssueStateByEmailUdoModel } from '../../model/BadgeIssueStateByEmailUdoModel';
import { BadgeExcelReadCountRdoModel } from '../../model/BadgeExcelReadCountRdoModel';

export default class BadgeStudentFlowApi {
  URL = getApiDomain() + '/api/badge/badgeStudents/';

  static instance: BadgeStudentFlowApi;

  studentMissionMailRequest(id: string, badgeMissionMailRequestCdo: BadgeMissionMailRequestCdoModel) {
    return axios.post<void>(this.URL + `sendmail?badgeStudentId=${id}`, badgeMissionMailRequestCdo);
  }

  excelRead(udo: BadgeIssueStateByEmailUdoModel) {
    //
    return axios
      .post<BadgeExcelReadCountRdoModel>(this.URL + `excel-challenge`, udo)
      .then((response) => (response && response.data) || null);
  }
}

Object.defineProperty(BadgeStudentFlowApi, 'instance', {
  value: new BadgeStudentFlowApi(),
  writable: false,
  configurable: false,
});
