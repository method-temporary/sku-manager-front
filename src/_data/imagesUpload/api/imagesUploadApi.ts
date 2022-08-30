import { axiosApi as axios } from 'shared/axios/Axios';
import { AxiosReturn } from 'shared/present/apiclient/AxiosReturn';
import { IdName } from '@nara.platform/accent';
import { CardIconType } from '../model/CardIconType';
import { IconModel } from '../model/IconModel';

const UPLOAD_URL = '/api/images-upload';

export function findIconGroups(iconType: CardIconType): Promise<IdName[]> {
  return axios.get(`${UPLOAD_URL}/icon-groups?iconType=${iconType}`).then(AxiosReturn);
}

export function thumbnailUpload(formData: FormData): Promise<string> {
  return axios
    .post(`${UPLOAD_URL}/upload/thumb`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then(AxiosReturn);
}

export function findIcons(groupId: string): Promise<IconModel[]> {
  return axios.get(`${UPLOAD_URL}/icons?groupId=${groupId}`).then(AxiosReturn);
}

export function panoptoThumbnailUpload(panoptoSessionId: string): Promise<string> {
  return axios.post(`${UPLOAD_URL}/upload/thumb/${panoptoSessionId}`).then(AxiosReturn);
}
