import ProfileInvitationApi from '../apiclient/ProfileInvitationApi';
import InvitationCdo from '../../model/InvitationCdo';

class ProfileInvitationService {
  //
  static instance: ProfileInvitationService;

  invitationApi: ProfileInvitationApi;

  constructor(invitationApi: ProfileInvitationApi) {
    this.invitationApi = invitationApi;
  }

  invite(invitationCdos: InvitationCdo[]): Promise<void> {
    //
    return this.invitationApi.invite(invitationCdos);
  }
}

ProfileInvitationService.instance = new ProfileInvitationService(ProfileInvitationApi.instance);
export default ProfileInvitationService;
