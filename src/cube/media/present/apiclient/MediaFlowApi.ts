import { axiosApi as axios } from 'shared/axios/Axios';

export default class MediaFlowApi {
  URL = '/api/cube/medias/flow';

  static instance: MediaFlowApi;

  // makeMedia(media: MediaFlowCdoModel) {
  //   return axios.post<string>(this.URL, media).then((response) => (response && response.data) || null);
  // }
  //
  // modSuperMedia(cubeId: string, mediaFlowUdoModel: MediaFlowUdoModel) {
  //   return axios.put<void>(this.URL + `/approved/${cubeId}`, mediaFlowUdoModel);
  // }
  //
  // makeMediaByUser(mediaFlowUserCdo: MediaFlowUserCdo) {
  //   return axios
  //     .post<string>(this.URL + '/byUser', mediaFlowUserCdo)
  //     .then((response) => (response && response.data) || null);
  // }
  //
  // modifyMedia(cubeId: string, mediaFlowUdoModel: MediaFlowUdoModel) {
  //   //
  //   return axios.put<void>(this.URL + `/${cubeId}`, mediaFlowUdoModel);
  // }

  removeMedia(cubeId: string) {
    //
    return axios.delete(this.URL + `/${cubeId}`);
  }
}

Object.defineProperty(MediaFlowApi, 'instance', {
  value: new MediaFlowApi(),
  writable: false,
  configurable: false,
});
