import { axiosApi as axios } from 'shared/axios/Axios';
import { NonGdiMemberCitizenCdo } from '../../model/dto/NonGdiMemberCitizenCdo';
import { NonGdiMemberCitizenUdo } from '../../model/dto/NonGdiMemberCitizenUdo';
import NonGdiMemberCitizensApplicationSdo from '../../model/dto/NonGdiMemberCitizensApplicationSdo';
import NonGdiMemberCitizensApplicationResult from '../../model/dto/NonGdiMemberCitizensApplicationResult';

class MemberCitizenApi {
  //
  URL = '/api/tenant/citizens';

  static instance: MemberCitizenApi;

  registerNonGdiMemberCitizen(cdo: NonGdiMemberCitizenCdo): Promise<string> {
    //
    return axios
      .postLoader(this.URL + `/registerNonGdiMemberCitizen`, cdo)
      .then((response) => (response && response.data) || null)
      .catch((error) => error.response);
  }

  modifyNonGdiMemberCitizen(udo: NonGdiMemberCitizenUdo): Promise<void> {
    //
    return axios
      .postLoader(this.URL + `/modifyNonGdiMemberCitizen`, udo)
      .then((response) => (response && response.data) || null);
  }

  deactivateNonGdiMemberCitizen(citizenIds: string[]): Promise<void> {
    //
    return axios
      .postLoader(this.URL + `/deactivateNonGdiMemberCitizen`, citizenIds)
      .then((response) => (response && response.data) || null);
  }

  applyNonGdiMemberCitizens(sdo: NonGdiMemberCitizensApplicationSdo): Promise<NonGdiMemberCitizensApplicationResult> {
    //
    return axios
      .postLoader(this.URL + `/applyNonGdiMemberCitizens`, sdo)
      .then((response) => (response && response.data) || null);
  }
}

MemberCitizenApi.instance = new MemberCitizenApi();
export default MemberCitizenApi;
