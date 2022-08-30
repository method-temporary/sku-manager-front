import { axiosApi as axios } from 'shared/axios/Axios';
import { OffsetElementList } from 'shared/model';
import { BadgeApproverModel } from '../../model/BadgeApproverModel';
import { BadgeApproverRdo } from '../../model/BadgeApproverRdo';
import { apiErrorHelper } from 'shared/helper';
import qs from 'qs';

export class BadgeApproverApi {
  URL = '/api/station/audiences';

  static instance: BadgeApproverApi;

  /** Badge 승인자 목록 조회
   *
   * @param badgeApproverRdo: BadgeApproverRdo
   */
  findAllApproverByQuery(badgeApproverRdo: BadgeApproverRdo): Promise<OffsetElementList<BadgeApproverModel>> {
    //
    const { offset, limit, cineroomId, name, email, roleKeys } = badgeApproverRdo;

    const params = `offset.offset=${offset}&offset.limit=${limit}&cineroomId=${cineroomId}&name=${name}&email=${email}&roleKeys=${roleKeys}`;

    return axios
      .get<OffsetElementList<BadgeApproverModel>>(`${this.URL}/identities/forMySuniManager?${params}`, {
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'comma' }),
      })
      .then((response) => OffsetElementList.fromResponse(response.data))
      .catch((response) => apiErrorHelper(response));
  }

  registApprover(approverIds: string[]) {
    //
    for (const approverIdsKey of approverIds) {
      axios
        .post(`${this.URL}/${approverIdsKey}/audienceRole?roleKey=BadgeApprover`)
        .then((response) => (response && response.data) || null);
    }
    // return axios.post(`${this.URL}/${approverIds[0]}/audienceRole?roleKey=BadgeApprover`)
    //   .then((response) => (response && response.data) || null);
  }

  removeApprover(approverIds: string[]) {
    //
    for (const approverIdsKey of approverIds) {
      axios
        .delete(`${this.URL}/${approverIdsKey}/audienceRole?roleKey=BadgeApprover`)
        .then((response) => (response && response.data) || null);
    }

    // return axios.delete(`${this.URL}/${approverIds[0]}/audienceRole?roleKey=BadgeApprover`)
    //   .then((response) => (response && response.data) || null);
  }
}

BadgeApproverApi.instance = new BadgeApproverApi();
export default BadgeApproverApi;
