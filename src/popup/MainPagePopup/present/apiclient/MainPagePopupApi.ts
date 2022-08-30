import qs from 'qs';

import { axiosApi as axios } from '@nara.platform/accent';

import { apiErrorHelper } from 'shared/helper';
import { OffsetElementList } from 'shared/model';

import { DashBoardSentenceDetailModel } from '_data/arrange/dashboardMessage/model';

import MainPagePopupRdo from '../../model/MainPagePopupRdo';
import MainPagePopupUdo from '../../model/MainPagePopupUdo';
import { MainPagePopupModel } from '../../model/MainPagePopupModel';

class MainPagePopupApi {
  //
  URL = '/api/board/popup';

  static instance: MainPagePopupApi;

  /** 메인페이지 팝업 리스트 조회 Api
   * @Method GET
   * @Param(Body) MainPagePopupRdo
   */
  findMainPagePopups(mainPagePopupRdo: MainPagePopupRdo): Promise<OffsetElementList<MainPagePopupModel>> {
    //
    return axios
      .get(`${this.URL + '/list'}`, {
        params: mainPagePopupRdo,
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: 'comma' });
        },
      })
      .then((response) => OffsetElementList.fromResponse(response.data))
      .catch((response) => apiErrorHelper(response));
  }

  /** 메인페이지 팝업 상세 조회 Api
   * @Method GET
   * @Param(Body) MainPagePopupRdo
   */
  findMainPagePopupsDetail(popupId: string): Promise<MainPagePopupModel> {
    //
    return axios
      .get(`${this.URL + '/' + popupId}`, {
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: 'comma' });
        },
      })
      .then((response) => (response && response.data) || null)
      .catch((response) => apiErrorHelper(response));
  }

  /** 메인페이지 팝업 저장 Api
   * @Method post
   * @Param(Body) MainPagePopupRdo
   */
  registerMainPagePopup(data: any): Promise<MainPagePopupModel> {
    return axios
      .post<DashBoardSentenceDetailModel>(`${this.URL}`, data)
      .then((response) => {
        return response && response.data && response.data;
      })
      .catch((response) => apiErrorHelper(response));
  }

  /** 메인페이지 팝업 수정 Api
   * @Method put
   * @Param(Body) MainPagePopupRdo
   */
  modifyMainPagePopup(mainPagePopupUdo: MainPagePopupUdo): Promise<string> {
    return axios
      .put<MainPagePopupModel>(`${this.URL + '/' + mainPagePopupUdo.id}`, mainPagePopupUdo)
      .then((response) => {
        return response && response.data && response.data;
      })
      .catch((response) => apiErrorHelper(response));
  }
}

MainPagePopupApi.instance = new MainPagePopupApi();
export default MainPagePopupApi;
