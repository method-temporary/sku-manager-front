import { axiosApi as axios } from 'shared/axios/Axios';
import { LinkedInTempCdoModel } from '../../model/LinkedInTempCdoModel';
import { LinkedInTempModel } from '../../model/LinkedInTempModel';

export default class LinkedInTempProcApi {
  URL: string = '/api/lecture/linkedIn';

  static instance: LinkedInTempProcApi;

  // findLearningCompleteProcById(linkedInTempId: string) {
  //   //
  //   return axios.get<LinkedInTempModel>(this.URL + `/byLearningCompleteProcId=${linkedInTempId}`)
  //     .then(response => response && response.data || null);
  // }

  registerLinkedInTempComplete(linkedInTempCdoList: LinkedInTempCdoModel[]) {
    //
    return axios
      .putLoader<LinkedInTempModel[]>(this.URL + '/registerLinkedInTempComplete', linkedInTempCdoList)
      .then((response) => (response && response.data) || null);
  }
}

Object.defineProperty(LinkedInTempProcApi, 'instance', {
  value: new LinkedInTempProcApi(),
  writable: false,
  configurable: false,
});
