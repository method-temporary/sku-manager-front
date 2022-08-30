import { axiosApi as axios, NameValueList } from '@nara.platform/accent';
import { ChangeEvent } from 'react';

const BASE_URL = '/api/community/file';

export function upload(e: ChangeEvent<HTMLInputElement>): Promise<string> | undefined {
  if (e.target.files === null) {
    return undefined
  }
  const file = e.target.files[0];
  if (!file.name.toLowerCase().endsWith(".jpg") && !file.name.toLowerCase().endsWith(".jpeg")
    && !file.name.toLowerCase().endsWith(".png") && !file.name.toLowerCase().endsWith(".gif")) {
    alert('확장자 오류');
    return;
  }
  const formData = new FormData();
  formData.append('file', file);
  /*eslint consistent-return: "off"*/
  return axios.post(BASE_URL, formData).then(r => r.data)
}