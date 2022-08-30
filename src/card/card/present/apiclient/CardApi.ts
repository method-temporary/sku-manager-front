import { axiosApi as axios } from 'shared/axios/Axios';

import qs from 'qs';

import { NameValueList, OffsetElementList, GroupBasedAccessRule } from 'shared/model';
import { setExcelHistoryParams } from 'shared/components/SubActions/sub/ExcelButton/store/ExcelHistoryStore';

import { CardModel } from '../../model/CardModel';
import { CardSdo } from '../../model/CardSdo';
import CardRdo from '_data/lecture/cards/model/CardRdo';

import { CardCdo } from '../../model/CardCdo';
import { CardAdminRdo } from '../../model/CardAdminRdo';
import { CardWithContents } from '../../model/CardWithContents';
import { CardRelatedCount } from '../../model/vo/CardRelatedCount';
import { CardWithAccessRuleResult } from '../../model/CardWithAccessRuleResult';
import { CardCount } from '../../model/vo/CardCount';
import { CardPolyglotUdo } from '../../../../_data/lecture/cards/model/CardPolyglotUdo';
import { CardDuplicateRdo } from '../../model/vo/CardDuplicateRdo';

export default class CardApi {
  //
  cardURL = '/api/lecture/cards';
  cardURLAdmin = '/api/lecture/cards/admin';

  static instance: CardApi;

  findByRdoForAdmin(
    cardRdo: CardAdminRdo,
    groupAccessRoles: GroupBasedAccessRule
  ): Promise<OffsetElementList<CardWithAccessRuleResult>> {
    // ): Promise<CardWithAccessRuleResult[]> {
    // 카드목록 조회

    return axios
      .post(this.cardURLAdmin + `/findByRdo`, groupAccessRoles, {
        params: cardRdo,
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'comma' }),
      })
      .then((response) => OffsetElementList.fromResponse(response.data));
    // .then((response) => (response && response.data.results) || []);
  }

  findCardIgnoringAccessibilityByQdoForAdmin(
    cardRdo: CardAdminRdo,
    groupAccessRoles: GroupBasedAccessRule
  ): Promise<OffsetElementList<CardWithAccessRuleResult>> {
    // ): Promise<CardWithAccessRuleResult[]> {
    // 카드목록 조회

    return axios
      .post(this.cardURLAdmin + `/findCardsIgnoringAccessibilityByQdo`, groupAccessRoles, {
        params: cardRdo,
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'comma' }),
      })
      .then((response) => OffsetElementList.fromResponse(response.data));
    // .then((response) => (response && response.data.results) || []);
  }

  findCardSdoForAdmin(cardId: string): Promise<CardSdo> {
    // 수정을 위한 카드 조회
    return axios
      .get(this.cardURLAdmin + `/cardSdo/${cardId}`)
      .then((response) => (response && response.data.results) || null);
  }

  find(cardId: string): Promise<CardModel> {
    //
    return axios
      .get(this.cardURL + `/findCard/${cardId}`)
      .then((response) => (response && response.data.results) || null);
  }

  findCards(ids: string[]): Promise<CardWithContents[]> {
    //
    return axios.get(this.cardURL + `/findCards?ids=${ids}`).then((response) => (response && response.data) || []);
  }

  // findCardsForAdmin(ids: string[]): Promise<CardWithContents[]> {
  //   //
  //   return axios.get(this.cardURLAdmin + `/findCards?ids=${ids}`).then((response) => (response && response.data) || []);
  // }
  findCardsForAdmin(ids: string[]): Promise<CardWithContents[]> {
    return axios.post(this.cardURLAdmin + '/findByIdsForAdmin', { ids }).then((res) => res.data || []);
  }

  findByCubeIdForAdmin(cubeId: string): Promise<CardWithContents[]> {
    //
    return axios
      .get(this.cardURLAdmin + `/findByCubeId/${cubeId}`)
      .then((response) => (response && response.data) || []);
  }

  findLastNApprovedForAdmin(lastN: number): Promise<CardWithContents[]> {
    //
    return axios
      .get(this.cardURLAdmin + `/lastNApproved/${lastN}`)
      .then((response) => (response && response.data) || []);
  }

  findTopNStudentPassedCardsByLastDayForAdmin(topN: number, lastDay: number): Promise<CardWithContents[]> {
    //
    return axios
      .get(this.cardURLAdmin + `/topNStudentPassed/${topN}/${lastDay}`)
      .then((response) => (response && response.data) || []);
  }

  modifyPolyglotsForAdmin(cardId: string, cardPolyglotUdo: CardPolyglotUdo): Promise<void> {
    //
    return axios
      .put(this.cardURLAdmin + `/polyglot/${cardId}`, cardPolyglotUdo)
      .then((response) => (response && response.data) || null);
  }

  /** Card 관리 목록 조회
   * @Method Get
   * @param cardRdo
   */
  async findAdminCards(cardRdo: CardRdo): Promise<OffsetElementList<CardWithContents>> {
    //
    const apiUrl = `${this.cardURLAdmin}/findByRdo`;

    setExcelHistoryParams({
      searchUrl: apiUrl,
      searchParam: cardRdo,
      workType: 'Excel Download',
    });

    return axios
      .getLoader(apiUrl, {
        params: cardRdo,
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'comma' }),
      })
      .then((response) => OffsetElementList.fromResponse(response.data));
  }

  /** Card 관리 목록 조회  RelatedCount( 학습자, 이수자 수 )
   * @Method Get
   * @param ids
   */
  findCardRelatedCounts(ids: string[]): Promise<CardRelatedCount[]> {
    //
    return axios.get(`${this.cardURL}/findCardRelatedCounts?ids=${ids}`).then((response) => response && response.data);
  }

  /** Card 상세 조회
   * @Method Get
   * @param cardId
   */
  findCard(cardId: string): Promise<CardWithContents> {
    //
    return axios.getLoader(`${this.cardURLAdmin}/${cardId}`).then((response) => response && response.data);
    // return axios.get(`${this.cardURL}/${cardId}`).then((response) => response && response.data);
  }

  /** Card 갯수 조회
   * @Method Get
   * @Param cardRdo
   */
  findCardCount(cardRdo: CardRdo): Promise<CardCount> {
    //
    return axios
      .get(`${this.cardURLAdmin}/count`, {
        params: cardRdo,
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'comma' }),
      })
      .then((response) => response && response.data);
  }

  /** Card Name 으로 찾기
   * @Method Get
   * @Param cardName
   */
  findCardDuplicateCardName(cardDuplicateRdo: CardDuplicateRdo) {
    //
    return axios
      .post(`${this.cardURLAdmin}/existDuplicateCardName`, cardDuplicateRdo)
      .then((response) => response && response.data);
  }

  /** Card 관리 Card 추가
   * @Method Post
   * @param cardCdo
   */
  registerCard(cardCdo: CardCdo) {
    //
    return axios.postLoader(`${this.cardURLAdmin}`, cardCdo).then((response) => response && response.data);
  }

  /** Card 관리 Card 수정
   * @Method Put
   * @param cardId
   * @param cardCdo
   */
  modifyCard(cardId: string, cardCdo: CardCdo) {
    //
    return axios.putLoader(`${this.cardURLAdmin}/${cardId}`, cardCdo).then((response) => response && response.data);
  }

  /** Card 관리 Card 삭제
   * @Method Delete
   * @Param cardId
   */
  removeCard(cardId: string): void {
    //
    axios.deleteLoader(`${this.cardURLAdmin}/delete/${cardId}`).then((response) => response && response.data);
  }

  /** Discussion 삭제
   * @Method Delete
   * @Param discussionId
   */
  removeDiscussion(discussionId: string): void {
    axios
      .deleteLoader(`${this.cardURLAdmin}/delete/cardDiscussion/${discussionId}`)
      .then((response) => response && response.data);
  }

  /** Card 승인 신청
   * @Method Post
   * @param cardId
   */
  approvalCard(cardId: string) {
    //
    return axios.putLoader(`${this.cardURLAdmin}/requestOpen/${cardId}`).then((response) => response && response.data);
  }

  /** Card 승인
   * @Method Post
   * @param cardId
   */
  openedCard(cardId: string) {
    //
    return axios.putLoader(`${this.cardURLAdmin}/open/${cardId}`).then((response) => response && response.data);
  }

  /** Card 반려
   * @Method Post
   * @param cardId
   * @param nameValues
   */
  rejectedCard(cardId: string, nameValues: NameValueList) {
    //
    return axios
      .putLoader(`${this.cardURLAdmin}/reject/${cardId}`, nameValues)
      .then((response) => response && response.data);
  }
}

Object.defineProperty(CardApi, 'instance', {
  value: new CardApi(),
  writable: false,
  configurable: false,
});
