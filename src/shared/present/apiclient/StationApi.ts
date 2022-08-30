// import { axiosApi as axios } from '@nara.platform/accent';
import { axiosApi as axios } from 'shared/axios/Axios';
import CineroomModel from '../../model/CineroomModel';
import AudienceIdentity from '../../model/AudienceIdentityModel';
import { OffsetElementList } from '../../model';
import CineroomManagerRoleUdo from '../../model/CineroomManagerRoleUdo';

class StationApi {
  //
  static instance: StationApi;

  URL = '/api/station';

  findCinerooms(): Promise<CineroomModel[]> {
    //
    return axios
      .get(`${this.URL}/cinerooms/identities/byType?pavilionId=ne1-m2&state=Active`)
      .then((response) => response && response.data);
  }

  findManagerIdentitiesByCineroomId(
    cineroomId: string,
    name: string,
    email: string,
    offset: number,
    limit: number
  ): Promise<OffsetElementList<AudienceIdentity>> {
    //
    return axios
      .getLoader(this.URL + `/audiences/userWorkspaceManagerIdentitiesByCineroomId`, {
        params: { cineroomId, name, email, offset, limit },
      })
      .then((response) => OffsetElementList.fromResponse(response.data));
  }

  assignCineroomManagerRole(udo: CineroomManagerRoleUdo): Promise<void> {
    //
    return axios
      .putLoader(this.URL + `/audiences/assignCineroomManagerRole`, udo)
      .then((response) => (response && response.data) || null);
  }

  cancelCineroomManagerRole(udo: CineroomManagerRoleUdo): Promise<void> {
    //
    return axios
      .putLoader(this.URL + `/audiences/cancelCineroomManagerRole`, udo)
      .then((response) => (response && response.data) || null);
  }
}

StationApi.instance = new StationApi();
export default StationApi;
