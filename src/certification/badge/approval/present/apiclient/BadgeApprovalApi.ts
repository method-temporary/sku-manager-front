import qs from 'qs';
import { axiosApi as axios } from 'shared/axios/Axios';
import { apiErrorHelper } from 'shared/helper';
import { OffsetElementList } from 'shared/model';
import { setExcelHistoryParams } from 'shared/components/SubActions/sub/ExcelButton/store/ExcelHistoryStore';
import BadgeApproveUdo from '../../model/BadgeApproveUdo';
import { BadgeRdo, BadgeWithStudentCountRomModel } from '_data/badge/badges/model';

class BadgeApprovalApi {
  //
  static instance: BadgeApprovalApi;

  URL = '/api/badge/badges/admin';

  /** Badge 승인요청 목록 조회 Api
   * @Method GET
   * @Param BadgeRdo
   */
  findBadges(badgeRdo: BadgeRdo): Promise<OffsetElementList<BadgeWithStudentCountRomModel>> {
    //
    const apiUrl = `${this.URL}/forApprover`;

    setExcelHistoryParams({
      searchUrl: apiUrl,
      searchParam: badgeRdo,
      workType: 'Excel Download',
    });

    return axios
      .get(apiUrl, {
        params: badgeRdo,
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'comma' }),
      })
      .then((response) => OffsetElementList.fromResponse(response.data))
      .catch((response) => apiErrorHelper(response));
  }

  /** Badge 승인 Api
   * @Method PUT
   * @Param(Body) BadgeApproveUdo
   */
  modifyAllBadgeStatesOpened(badgeApproveUdo: BadgeApproveUdo) {
    //
    return axios
      .put(`${this.URL}/openBadges?badgeIds=${badgeApproveUdo.badgeIds}`)
      .then((response) => response.data)
      .catch((response) => apiErrorHelper(response));
  }

  /** Badge 반려 Api
   * @Method PUT
   * @Param(Body) BadgeApproveUdo
   */
  modifyAllBadgesStatesRejected(badgeApproveUdo: BadgeApproveUdo) {
    //
    const { badgeIds, remark } = badgeApproveUdo;

    return axios
      .put(`${this.URL}/rejectBadges`, { badgeIds, remark })
      .then((response) => response.data)
      .catch((response) => apiErrorHelper(response));
  }
}

BadgeApprovalApi.instance = new BadgeApprovalApi();
export default BadgeApprovalApi;
