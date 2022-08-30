import { axiosApi as axios } from '@nara.platform/accent';
import InvitationCdo from '../../model/InvitationCdo';

class ProfileInvitationApi {
  //
  static instance: ProfileInvitationApi;

  URL = '/api/user/users';

  invite(invitationCdos: InvitationCdo[]): Promise<void> {
    //
    return axios
      .post(this.URL + '/admin/invite', invitationCdos)
      .then((response) => (response && response.data) || null);
  }
}

ProfileInvitationApi.instance = new ProfileInvitationApi();
export default ProfileInvitationApi;
