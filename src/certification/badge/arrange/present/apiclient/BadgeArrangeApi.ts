import { axiosApi as axios } from 'shared/axios/Axios';
import { BadgeArrangeFlowUdoModel } from '../../model/BadgeArrangeFlowUdoModel';
import { apiErrorHelper } from 'shared/helper';

class BadgeArrangeApi {
  URL = '/api/badge/badges/admin';

  static instance: BadgeArrangeApi;

  modifyBadgeArrange(badgeUdo: BadgeArrangeFlowUdoModel) {
    //
    return axios
      .put<string>(`${this.URL}/modifyDisplayOrders?categoryId=${badgeUdo.categoryId}`, badgeUdo.badgeIds)
      .then((response) => (response && response.data) || '')
      .catch((response) => apiErrorHelper(response));
  }
}

BadgeArrangeApi.instance = new BadgeArrangeApi();
export default BadgeArrangeApi;
