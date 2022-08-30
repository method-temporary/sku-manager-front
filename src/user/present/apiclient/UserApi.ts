import useSWR from 'swr';
import { axiosApi as axios } from 'shared/axios/Axios';
import { OffsetElementList } from 'shared/model';
import { AxiosReturn } from 'shared/present';
import { setExcelHistoryParams } from 'shared/components/SubActions/sub/ExcelButton/store/ExcelHistoryStore';

import { UserModel } from '../../model/UserModel';
import { UserRdo } from '../../model/UserRdo';
import { StudySummary } from '../../model/StudySummary';

import UserGroupAssignModel from '../../../usergroup/group/model/UserGroupAssignModel';
import { UserExcelUploadModel } from '../../model/UserExcelUploadModel';
import { UserExcelUploadResponse } from '../../model/UserExcelUploadResponse';
import UserWithRelatedInformationRom from '../../model/UserWithRelatedInformationRom';
import { UserInfoUdo } from '../../model/UserInfoUdo';
import { UserWithPisAgreement } from '../../model/UserWithPisAgreement';
import { UserDetailModel } from '../../model/UserDetailModel';

const userApi = {
  users: {
    findUser: '/api/user/users',
  },
};

export function useFindUser() {
  const {
    data: myData,
    error,
    mutate: myDataMutate,
  } = useSWR(userApi.users.findUser, (url) => {
    return axios.get<UserModel>(url).then(AxiosReturn);
  });

  return {
    myData,
    isLoadingL: !myData && !error,
    myDataMutate,
  };
}
class UserApi {
  //
  URL = '/api/user/users';
  SSO_URL = '/api/checkpoint/sso';

  static instance: UserApi;

  //User 본인 상세보기
  findUser() {
    return axios.get<UserModel>(this.URL).then((response) => (response && response.data) || null);
  }

  //Manager, SuprManager : SearchKey 검색
  findAllUserBySearchKey(userRdo: UserRdo) {
    const apiUrl = this.URL + `/admin/withPisAgreement`;

    setExcelHistoryParams({
      searchUrl: apiUrl,
      searchParam: userRdo,
      workType: 'Excel Download',
    });

    //
    return axios
      .getLoader<OffsetElementList<UserWithPisAgreement>>(apiUrl, { params: userRdo })
      .then((response) => (response && response.data) || OffsetElementList.newEmpty());
  }

  //Manager, SuperManager 조회
  findStudySummaryByUserId(userId: string) {
    return axios
      .get<StudySummary>(this.URL + `/admin/${userId}/withAdditionalInfo`)
      .then((response) => (response && response.data) || null);
  }

  findUserWithRelatedInformationForAdmin(
    skProfileRdo: UserRdo
  ): Promise<OffsetElementList<UserWithRelatedInformationRom>> {
    //
    return axios
      .get(this.URL + '/admin/withInvitation', { params: skProfileRdo })
      .then((response) => OffsetElementList.fromResponse(response.data));
  }

  findUserById(id: string): Promise<UserDetailModel> {
    //
    return axios.get(this.URL + `/admin/${id}/detail`).then((response) => response.data);
  }

  /** User 에 UserGroup 할당 ( Assign )
   * Method: PUT
   * Param(BODY): memberIds<string>[], userGroupSequence{ groupSequences : <number>[] }
   * USE: SkProfile List assignUserGroup
   */
  modifyUserAssignUserGroup(userGroupAssignModel: UserGroupAssignModel) {
    //
    return axios.put<void>(this.URL + `/admin/assignUserGroupSequences`, userGroupAssignModel);
  }

  /** User 에 UserGroup 재할당 ( ReAssign => 기존 지우고 새로 다 넣음 )
   * Method: PUT
   * Param(BODY): memberIds<string>[], userGroupSequence{ groupSequences : <number>[] }
   * USE: SkProfile List assignUserGroup
   */
  modifyUserReAssignUserGroup(userGroupAssignModel: UserGroupAssignModel) {
    //
    return axios.put<void>(this.URL + `/admin/assignUserGroupSequences`, userGroupAssignModel);
  }

  /** User 에 UserGroup 할당 해제
   * Method: PUT
   * Param(BODY): memberIds<string>[], userGroupSequence{ groupSequences : <number>[] }
   * USE: SkProfile List assignUserGroup
   */
  modifyUserWithdrawUserGroup(userGroupAssignModel: UserGroupAssignModel) {
    //
    return axios.put<void>(this.URL + `/admin/withdrawUserGroupSequences`, userGroupAssignModel);
  }

  /** User UploadExcel
   * Method: PUT
   * Param(BODY): SkProfileExcelUploadModel[]
   */
  reassignUserGroupWithExcel(userExcelUploadModel: UserExcelUploadModel[]): Promise<UserExcelUploadResponse> {
    //
    return axios.putLoader(this.URL + `/admin`, userExcelUploadModel).then((response) => response && response.data);
  }

  /** User Default Password
   * Method: POST
   * Param(QUERY): password, email
   */
  modifyUserDefaultPassword(password: string, email: string) {
    //
    return (
      axios
        .postLoader(`${this.SSO_URL}/resetDefaultPassword`, { password, email })
        // .post(`${this.SSO_URL}/resetDefaultPassword?password=${password}&email=${email}`)
        .then((response) => response && response.data)
    );
  }

  /** User Info ( Gender, BirthDate )
   * Method: POST
   * Param(QUERY): userId, UserInfoUdo( gender, birthDate )
   */
  modifyUserInfo(userInfoUdo: UserInfoUdo) {
    //
    return (
      axios
        .put(`${this.URL}/admin`, [userInfoUdo])
        // .post(`${this.SSO_URL}/resetDefaultPassword?password=${password}&email=${email}`)
        .then((response) => response && response.data)
    );
  }
}

UserApi.instance = new UserApi();
export default UserApi;
