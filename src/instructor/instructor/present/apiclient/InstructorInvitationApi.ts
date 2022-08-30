import { axiosApi as axios } from '@nara.platform/accent';
import InvitationCdo from '../../model/vo/InvitationCdo';

class InstructorInvitationApi {
  //
  static instance: InstructorInvitationApi;

  URL = '/api/user/admin/instructors';

  invite(invitationCdos: InvitationCdo[]): Promise<void> {
    //
    return axios.post(this.URL + '/invite', invitationCdos).then((response) => (response && response.data) || null);
  }
}

InstructorInvitationApi.instance = new InstructorInvitationApi();
export default InstructorInvitationApi;
