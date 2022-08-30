import { axiosApi as axios } from 'shared/axios/Axios';
import { IconModel, IdName, FileUploadType, FileModel, CardIconType } from '../../model';

class SharedApi {
  //
  static instance: SharedApi;

  UPLOAD_URL = '/api/images-upload';

  uploadFile(formData: FormData, type?: FileUploadType): Promise<string> {
    //
    return axios
      .post(`${this.UPLOAD_URL}/upload/${type}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((response) => response && response.data);
  }

  thumbnailUpload(formData: FormData): Promise<string> {
    return axios
      .post(`${this.UPLOAD_URL}/upload/thumb`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((response) => response && response.data);
  }

  panoptoThumbnailUpload(panoptoSessionId: string): Promise<string> {
    return axios
      .post(`${this.UPLOAD_URL}/upload/thumb/${panoptoSessionId}`)
      .then((response) => response && response.data);
  }

  findPanoptoFile(panoptoSessionId: string) {
    return axios.post(`${this.UPLOAD_URL}/upload/thumb/${panoptoSessionId}`);
  }

  findFile(path: string): Promise<FileModel> {
    //
    return axios.get(`${this.UPLOAD_URL}/upload/${path}`).then((response) => response && response.data);
  }

  findIconGroups(iconType: CardIconType): Promise<IdName[]> {
    //
    return axios
      .get(`${this.UPLOAD_URL}/icon-groups?iconType=${iconType}`)
      .then((response) => response && response.data);
  }

  findIcons(groupId: string): Promise<IconModel[]> {
    //
    return axios.get(`${this.UPLOAD_URL}/icons?groupId=${groupId}`).then((response) => response && response.data);
  }
}

SharedApi.instance = new SharedApi();
export default SharedApi;
