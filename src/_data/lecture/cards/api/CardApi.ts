import { axiosApi as axios, paramsSerializer } from 'shared/axios/Axios';
import { GroupBasedAccessRule, NameValueList, OffsetElementList } from 'shared/model';
import { AxiosReturn } from 'shared/present';
import { setExcelHistoryParams } from 'shared/components/SubActions/sub/ExcelButton/store/ExcelHistoryStore';

import CardRdo from '../model/CardRdo';
import CardWithContentsAndRelatedCount from '../model/CardWithContentsAndRelatedCount';
import CardAdminCount from '../model/CardAdminCount';

import { CardWithContents } from '../../../../card';
import { CardPolyglotUdo } from '../model/CardPolyglotUdo';
import { CardWithAccessRuleResult } from '../model/CardWithAccessRuleResult';
import { CardDiscussion } from '../model/CardDiscussion';
import { CardSdo } from '../model/CardSdo';

const DEFAULT_URL = '/api/lecture/cards';
const ADMIN_URL = DEFAULT_URL + '/admin';

/**
 * Card 관리 목록 조회
 * @param cardRdo
 * @return OffsetElementList<CardWithContentsAndRelatedCount>
 */
export function findCardByRdo(cardRdo: CardRdo): Promise<OffsetElementList<CardWithContentsAndRelatedCount>> {
  //
  const apiUrl = `${ADMIN_URL}/findByRdo`;

  setExcelHistoryParams({
    searchUrl: apiUrl,
    searchParam: cardRdo,
    workType: 'Excel Download',
  });

  return axios
    .getLoader(apiUrl, {
      params: cardRdo,
      paramsSerializer,
    })
    .then(AxiosReturn);
}

/**
 * Card 갯수 조회
 * @param cardRdo
 * @return CardAdminCount
 */
export const findCardCount = (cardRdo: CardRdo): Promise<CardAdminCount> => {
  //
  return axios
    .get(`${ADMIN_URL}/count`, {
      params: cardRdo,
      paramsSerializer,
    })
    .then((response) => response && response.data);
};

/**
 * Card 다국어 Excel Upload 수정
 * @param cardPolyglotUdo
 */
export const modifyPolyglotsForAdmin = (cardPolyglotUdo: CardPolyglotUdo) => {
  //
  return axios.put(`${ADMIN_URL}/polyglot/${cardPolyglotUdo.cardId}`, cardPolyglotUdo).then(AxiosReturn);
};

/**
 * Card 접근제어 여부 포함 목록 조회
 * @param cardRdo
 * @param groupAccessRoles
 */
export const findByRdoForModal = (
  cardRdo: CardRdo,
  groupAccessRoles: GroupBasedAccessRule
): Promise<OffsetElementList<CardWithAccessRuleResult>> => {
  return axios
    .post(`${ADMIN_URL}/findByRdo`, groupAccessRoles, {
      params: cardRdo,
      paramsSerializer,
    })
    .then(AxiosReturn);
};

/**
 * Card 단일 조회
 * @param cardId
 */
export const findCardById = (cardId: string): Promise<CardWithContentsAndRelatedCount> => {
  //
  return axios.get(`${ADMIN_URL}/${cardId}`).then(AxiosReturn);
};

export const findCubeDiscussionById = (discussionId: string): Promise<CardDiscussion> => {
  return axios.get(`${DEFAULT_URL}/cardDiscussion/${discussionId}`).then(AxiosReturn);
};

/**
 * Card Detail id 단건 조회
 * @param id
 */
//#Deprecated
export const findCardForAdmin = (id: string): Promise<CardWithContents> => {
  return axios.get(`${ADMIN_URL}/${id}`).then(AxiosReturn);
};

/** Card 승인
 * @Method Post
 * @param cardId
 */
export const openedCard = (cardId: string) => {
  //
  return axios.put(`${ADMIN_URL}/open/${cardId}`).then((response) => response && response.data);
};

/** Card 반려
 * @Method Post
 * @param cardId
 * @param nameValues
 */
export const rejectedCard = (cardId: string, nameValues: NameValueList) => {
  //
  return axios.putLoader(`${ADMIN_URL}/reject/${cardId}`, nameValues).then((response) => response && response.data);
};

/**
 * Card 가져오기 모달 목록
 */
export const findCardByRdoIgnoreAccessRule = (
  cardRdo: CardRdo,
  groupAccessRoles: GroupBasedAccessRule
): Promise<OffsetElementList<CardWithAccessRuleResult>> => {
  return axios
    .post(`${ADMIN_URL}/findCardsIgnoringAccessibilityByQdo`, groupAccessRoles, {
      params: cardRdo,
      paramsSerializer,
    })
    .then(AxiosReturn);
};

/**
 * Card 생성
 * @param card
 */
export const registerCard = (card: CardSdo, requestOpen: boolean): Promise<string> => {
  return axios.post(`${ADMIN_URL}?requestOpen=${requestOpen}`, card).then(AxiosReturn);
};

/**
 * Card 수정
 * @param cardId
 * @param card
 */
export const modifyCard = (cardId: string, card: CardSdo) => {
  //
  return axios.putLoader(`${ADMIN_URL}/${cardId}`, card).then(AxiosReturn);
};

export const approvalCard = (cardId: string) => {
  return axios.putLoader(`${ADMIN_URL}/requestOpen/${cardId}`).then((response) => response && response.data);
};
