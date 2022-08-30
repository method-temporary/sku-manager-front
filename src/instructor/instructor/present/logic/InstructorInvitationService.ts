import InstructorInvitationApi from '../apiclient/InstructorInvitationApi';
import ProfileInvitationService from '../../../../user/present/logic/ProfileInvitationService';
import InvitationCdo from '../../model/vo/InvitationCdo';

class InstructorInvitationService {
  //
  static instance: InstructorInvitationService;

  invitationApi: InstructorInvitationApi;

  constructor(invitationApi: InstructorInvitationApi) {
    this.invitationApi = invitationApi;
  }

  invite(invitationCdos: InvitationCdo[]): Promise<void> {
    //
    return this.invitationApi.invite(invitationCdos);
  }
}

InstructorInvitationService.instance = new InstructorInvitationService(InstructorInvitationApi.instance);
export default InstructorInvitationService;
