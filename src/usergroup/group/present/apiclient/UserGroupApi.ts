import { axiosApi as axios } from 'shared/axios/Axios';

import { apiErrorHelper } from 'shared/helper';
import { NameValueList, OffsetElementList } from 'shared/model';
import UserGroupEmailExcelResultModel from 'usergroup/group/model/UserGroupEmailExcelResultModel';
import UserGroupEmailsModel from 'usergroup/group/model/UserGroupEmailslModel';

import { UserGroupRdo } from '../../model';
import { UserGroupCdo, UserGroupQueryModel } from '../../model';

class UserGroupApi {
  //
  URL = '/api/user/userGroups';
  USER_URL = '/api/user/users';

  static instance: UserGroupApi;

  /* UserGroupCategory Api 명명규칙
   * find(All)UserGroup(Enabled)
   * All: O -> limit => 9999999 ( 전체 목록 ), X -> limit 만큼
   * Enabled: O -> ( true: Enabled Or false: Disabled), X -> ( Enabled + Disabled )
   */

  /** UserGroup 목록 전체 조회 api  ( 모든 UserGroup )
   * @Method GET
   * @Param(QUERY) {offset}, {limit}
   * @USE SkProfile List
   */
  findAllUserGroup(): Promise<OffsetElementList<UserGroupQueryModel>> {
    //
    return axios
      .get(`${this.URL}?offset=0&limit=9999999`)
      .then((response) => OffsetElementList.fromResponse(response.data))
      .catch((response) => apiErrorHelper(response));
  }

  /** UserGroup 목록 조회 api ( Paging 처리된 화면에서 mySuni + 본인 관계사 인 UserGroup )
   * @Method GET
   * @Param(QUERY) {offset}, {limit}, {startDate}, {endDate}, {name}, {enabled}
   * @USE UserGroup List
   */
  findUserGroups(userGroupRdo: UserGroupRdo): Promise<OffsetElementList<UserGroupQueryModel>> {
    //
    return axios
      .getLoader(`${this.URL}/withUserCount`, { params: userGroupRdo })
      .then((response) => OffsetElementList.fromResponse(response.data))
      .catch((response) => apiErrorHelper(response));
  }

  /** UserGroup 단건 조회 api ( 사용자 그룹 Id )
   * @Method GET
   * @Param(URL) {userGroupId}
   * @USE Create, Update UserGroup
   */
  findUserGroupById(userGroupId: string): Promise<UserGroupQueryModel> {
    //
    return axios
      .getLoader(`${this.URL}/${userGroupId}`)
      .then((response) => OffsetElementList.fromResponse(response.data))
      .catch((response) => apiErrorHelper(response));
  }

  // AccessRole 에서 사용중
  /** UserGroup CategoryId별 목록 조회 api ( CategoryId )
   * @Method GET
   * @Param(QUERY) {categoryId}
   * @USE AccessRole
   */
  findAllUserGroups(categoryId: string): Promise<UserGroupQueryModel[]> {
    //
    return axios
      .get(`${this.URL}/userGroupCategory/${categoryId}?enabled=true`)
      .then((response) => response.data)
      .catch((response) => apiErrorHelper(response));
  }

  /** UserGroup 단건 조회 api ( 사용자 그룹 명 )
   * @Method GET
   * @Param(QUERY) {userGroupId}
   * @USE Create UserGroup
   */
  findUserGroupByName(userGroupName: string): Promise<OffsetElementList<UserGroupQueryModel>> {
    //
    return axios
      .get(`${this.URL}?name=${userGroupName}`)
      .then((response) => OffsetElementList.fromResponse(response.data))
      .catch((response) => apiErrorHelper(response));
  }

  /** UserGroup 저장
   * @Method POST
   * @Param(BODY) {userGroupName, userGroupCategoryId}: UserGroupCdo
   */
  registerUserGroup(userGroupCdo: UserGroupCdo) {
    //
    return axios
      .postLoader(this.URL, userGroupCdo)
      .then((response) => response && response.data)
      .catch((response) => apiErrorHelper(response));
  }

  /** UserGroup 수정
   * @Method PUT
   * @Param(URL) {userGroupId}
   * @Param(BODY) nameValues:[ { 'name': 'name', 'value': ${userGroupName} }, { 'name': 'name', 'value': ${userGroupCategoryId} } ]: nameValues
   */
  modifyUserGroup(userGroupId: string, nameValues: NameValueList) {
    //
    return axios
      .putLoader(`${this.URL}/${userGroupId}`, nameValues)
      .then((response) => response)
      .catch((response) => apiErrorHelper(response));
  }

  /** UserGroup 삭제
   * @Method DELETE
   * @Param(URL) [{userGroupId}, {userGroupId}, {userGroupId}, ... ]
   */
  removeUserGroup(idValues: string[]) {
    //
    return axios
      .deleteLoader(`${this.URL}`, { data: idValues })
      .then((response) => response)
      .catch((response) => apiErrorHelper(response));
  }

  /** UserGroup Enable(활성화)
   * @Method PUT
   * @Param(BODY) [{userGroupId}, {userGroupId}, {userGroupId}, ... ]
   */
  enabledUserGroup(idValues: string[]) {
    //
    return axios
      .putLoader(`${this.URL}/enable`, idValues)
      .then((response) => response)
      .catch((response) => apiErrorHelper(response));
  }

  /** UserGroup Disable(비활성화)
   * @Method PUT
   * @Param(BODY) [{userGroupId}, {userGroupId}, {userGroupId}, ... ]
   */
  disabledUserGroup(idValues: string[]) {
    //
    return axios
      .putLoader(`${this.URL}/disable`, idValues)
      .then((response) => response)
      .catch((response) => apiErrorHelper(response));
  }

  /** Email로 userGroup 할당
   * @Method PUT
   * @Param(BODY) {emails: string[], userGroupSequences: UserGroupSequenceModel}: UserGroupEmailsModel
   */
  assignUserGroupByEmail(userGroupEmailsModel: UserGroupEmailsModel): Promise<UserGroupEmailExcelResultModel> {
    //
    return axios
      .putLoader(`${this.USER_URL}/admin/assignUserGroupSequencesByEmail`, userGroupEmailsModel)
      .then((response) => (response && response.data) || null)
      .catch((response) => apiErrorHelper(response));
  }
}

UserGroupApi.instance = new UserGroupApi();
export default UserGroupApi;
