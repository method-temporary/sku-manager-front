import qs from 'qs';
import { axiosApi as axios } from 'shared/axios/Axios';
import { NameValueList, OffsetElementList } from 'shared/model';
import { apiErrorHelper } from 'shared/helper';
import { setExcelHistoryParams } from 'shared/components/SubActions/sub/ExcelButton/store/ExcelHistoryStore';
import BadgeRdo from '../model/BadgeRdo';
import BadgeCdo from '../model/BadgeCdo';
import BadgeCountModel from '../model/BadgeCountModel';
import BadgeWithStudentCountRomModel from '../model/BadgeWithStudentCountRomModel';
import BadgeWithOperatorRom from '../model/BadgeWithOperatorRom';
import { BadgeWithCategory } from '../model/BadgeWithCategory';
import { BadgeModel } from '../model/BadgeModel';

class BadgeApi {
  //
  URL = '/api/badge/badges/admin';

  static instance: BadgeApi;

  /** Badge 목록 조회 Api
   * @Method GET
   * @Param(Body) BadgeRdo
   */
  findBadges(badgeRdo: BadgeRdo): Promise<OffsetElementList<BadgeWithStudentCountRomModel>> {
    //
    const apiUrl = `${this.URL}`;

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

  /** Badge 단일 조회 Api
   * @Method GET
   * @Param(URL) BadgeID
   */
  findBadge(badgeId: string): Promise<BadgeWithOperatorRom> {
    //
    return axios
      .get(`/api/badge/badges/${badgeId}/withOperator`)
      .then((response) => response && response.data)
      .catch((response) => apiErrorHelper(response));
  }

  /** Badge 갯수 조회 Api
   * @Method GET
   */
  findBadgeCounts(badgeRdo: BadgeRdo): Promise<BadgeCountModel> {
    //
    return axios
      .get(`${this.URL}/counts`, {
        params: badgeRdo,
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'comma' }),
      })
      .then((response) => response && response.data)
      .catch((response) => apiErrorHelper(response));
  }

  /** 관련 Badge 목록 조회
   * @Method GET
   * @Param badgeIds
   */
  findRelatedBadges(Ids: string[]): Promise<BadgeModel[]> {
    //
    return axios.get(`${this.URL}/byIds?ids=${Ids}`).then((response) => response.data);
  }

  /** Badge 추가 Api
   * @Method POST
   * @Param(Body) BadgeCdo
   */
  registerBadge(badgeCdo: BadgeCdo) {
    //
    return axios
      .post(this.URL, badgeCdo)
      .then((response) => response.data)
      .catch((response) => apiErrorHelper(response));
  }

  /** Badge 수정 Api
   * @Method PUT
   * @Param(URL) BadgeId
   * @Param(Body) Badge NameValues
   */
  modifiedBadge(badgeId: string, nameValues: NameValueList) {
    //
    return axios
      .put(`${this.URL}/${badgeId}`, nameValues)
      .then((response) => response.data)
      .catch((response) => apiErrorHelper(response));
  }

  /** Badge 단일 검색 Api
   * @Method GET
   * @Param(URL) BadgeId
   */
  findBadgeByCardId(cardId: string): Promise<BadgeWithCategory[]> {
    //
    return axios
      .get(`/api/badge/badges/byCardId?cardId=${cardId}`)
      .then((response) => response.data)
      .catch((response) => apiErrorHelper(response));
  }
}

BadgeApi.instance = new BadgeApi();
export default BadgeApi;
