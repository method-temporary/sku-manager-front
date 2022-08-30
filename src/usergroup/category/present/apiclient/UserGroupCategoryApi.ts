import { axiosApi as axios } from 'shared/axios/Axios';

import { NameValueList, OffsetElementList } from 'shared/model';

import {
  UserGroupCategoryCdo,
  UserGroupCategoryRdo,
  UserGroupCategoryQueryModel,
  UserGroupCategoryWithUserGroups,
} from '../../model';

class UserGroupCategoryApi {
  //
  URL = '/api/user/userGroupCategories';

  static instance: UserGroupCategoryApi;

  /* UserGroupCategory Api 명명규칙
   * find(All)(My)UserGroupCategories(Enabled)
   * All: O -> limit => 9999999 ( 전체 목록 ), X -> limit 만큼
   * MY: O -> 본인 관계사 목록만, X -> mySuni + 본인 관계사 ( mySuni 관계사는 전체 목록 ) Cineroom: ( 본인 관계사만 ( mySuni 도 mySuni만 )
   * Enabled: O -> ( true: Enabled Or false: Disabled), X -> ( Enabled + Disabled )
   */

  /** UserGroupCategory 목록 조회 Api ( Paging 처리된 화면에서 mySuni + 본인 관계사 인 Categories )
   * @param userGroupCategoryRdo: UserGroupCategoryRdo
   * @return Promise<OffsetElementList<UserGroupCategoryQueryModel>>
   * @Method GET
   * @Param(QUERY) {offset} {limit} {startDate} {endDate} {name} {cineroomId}
   * @USE UserGroupCategory List 조회
   */
  findUserGroupCategories(
    userGroupCategoryRdo: UserGroupCategoryRdo
  ): Promise<OffsetElementList<UserGroupCategoryQueryModel>> {
    //
    return axios
      .getLoader(`${this.URL}/allUserGroupCategories`, { params: userGroupCategoryRdo })
      .then((response) => OffsetElementList.fromResponse(response.data));
  }

  /** UserGroupCategory 목록 조회 Api ( 본인 관계사에서 Enabled 인 모든 Category )
   * @param enabled: boolean
   * @return Promise<UserGroupCategoryQueryModel[]>
   * @Method GET
   * @Param(BasicSearch) {limit = 999999} {enabled = true}
   * @USE Create UserGroup
   */
  findAllCineroomUserGroupCategoriesEnabled(enabled: boolean): Promise<OffsetElementList<UserGroupCategoryQueryModel>> {
    //
    return (
      axios
        // .get(`${this.URL}/cineroomsUserGroupCategories?limit=999999&enabled=${enabled}`)
        .get(`${this.URL}/cineroomsUserGroupCategories?limit=999999&enabled=${enabled}`)
        .then((response) => OffsetElementList.fromResponse(response.data))
    );
  }

  /** UserGroupCategory 목록 조회 Api ( mySuni + 본인 관계사에서 Enabled Or Disabled 인 모든 Category )
   * @param enabled: boolean
   * @return Promise<OffsetElementList<UserGroupCategoryQueryModel>>
   * @Method GET
   * @Param(BasicSearch) {limit = 999999} {enabled}
   * @USE Access Role
   */
  findAllUserGroupCategoriesEnabled(enabled: boolean): Promise<OffsetElementList<UserGroupCategoryQueryModel>> {
    //
    return axios
      .get(`${this.URL}/allUserGroupCategories?limit=999999&enabled=${enabled}`)
      .then((response) => OffsetElementList.fromResponse(response.data));
  }

  /** UserGroupCategory 단건 조회 api ( 사용자 그룹 분류 Id )
   * @param userGroupCategoryId: string
   * @return Promise<UserGroupCategoryQueryModel>
   * @Method GET
   * @Param(URL) {userGroupCategoryId}
   * @USE Create, Update UserGroupCategory
   */
  findUserGroupCategoryById(userGroupCategoryId: string): Promise<UserGroupCategoryQueryModel> {
    //
    return axios.get(`${this.URL}/${userGroupCategoryId}`).then((response) => response.data);
  }

  /** UserGroupCategory 단건 조회 api ( 사용자 그룹 분류 명 )
   * @param userGroupCategoryName: string
   * @return Promise<OffsetElementList<UserGroupCategoryQueryModel>>
   * @Method GET
   * @Param(QUERY) {userGroupCategoryName}
   * @USE Check overlap Name
   */
  findUserGroupCategoryByName(userGroupCategoryName: string): Promise<OffsetElementList<UserGroupCategoryQueryModel>> {
    //
    return axios
      .get(`${this.URL}/myUserGroupCategories?name=${userGroupCategoryName}`)
      .then((response) => OffsetElementList.fromResponse(response.data));
  }

  /** UserGroupCategory 저장
   * @param userGroupCategoryCdo: UserGroupCategoryCdo
   * @Method POST
   * @Param(BODY) {userGroupCategoryId, userGroupCategoryName, createDate, creator}: userGroupCategoryCdo
   */
  registerUserGroupCategory(userGroupCategoryCdo: UserGroupCategoryCdo) {
    //
    return axios.postLoader<string>(this.URL, userGroupCategoryCdo).then((response) => response && response.data);
  }

  /** UserGroupCategory 수정
   * @param userGroupCategoryId string
   * @param nameValues NameValueList
   * @Method PUT
   * @Param(URL) {userGroupCategoryId}
   * @Param(BODY) nameValues:[{ 'name': 'name', 'value': ${userGroupCategoryName} }]:nameValues
   */
  modifyUserGroupCategory(userGroupCategoryId: string, nameValues: NameValueList) {
    //
    return axios.putLoader(`${this.URL}/${userGroupCategoryId}`, nameValues).then((response) => response);
  }

  /** UserGroupCategory 삭제
   * @param idValues string[]
   * @Method DELETE
   * @Param(BODY) [{userGroupCategoryId}, {userGroupCategoryId}, {userGroupCategoryId}, ... ]
   */
  removeUserGroupCategory(idValues: string[]) {
    //
    return axios.deleteLoader(`${this.URL}`, { data: idValues }).then((response) => response);
  }

  /** UserGroupCategory Enable(활성화)
   * @param idValues string[]
   * @Method PUT
   * @Param(BODY) [{userGroupCategoryId}, {userGroupCategoryId}, {userGroupCategoryId}, ... ]
   */
  enabledUserGroupCategory(idValues: string[]) {
    //
    return axios.putLoader(`${this.URL}/enable`, idValues).then((response) => response);
  }

  /** UserGroupCategory Disable(비활성화)
   * @param idValues: string[]
   * @Method PUT
   * @Param(BODY) [{userGroupCategoryId}, {userGroupCategoryId}, {userGroupCategoryId}, ... ]
   */
  disabledUserGroupCategory(idValues: string[]) {
    //
    return axios.putLoader(`${this.URL}/disable`, idValues).then((response) => response);
  }

  findUserGroupCategoriesWithUserGroupsByUserWorkspaceId(
    userWorkspaceId: string
  ): Promise<UserGroupCategoryWithUserGroups[]> {
    return axios
      .get(this.URL + `/admin/withUserGroupsByUserWorkspaceId?userWorkspaceId=${userWorkspaceId}`)
      .then((response) => (response && response.data) || null);
  }

  findUserGroupCategoriesWithUserGroupsByUserWorkspaceUsid(
    userWorkspaceUsid: string
  ): Promise<UserGroupCategoryWithUserGroups[]> {
    return axios
      .get(this.URL + `/admin/withUserGroupsByUserWorkspaceUsid?userWorkspaceUsid=${userWorkspaceUsid}`)
      .then((response) => (response && response.data) || null);
  }
}

UserGroupCategoryApi.instance = new UserGroupCategoryApi();
export default UserGroupCategoryApi;
