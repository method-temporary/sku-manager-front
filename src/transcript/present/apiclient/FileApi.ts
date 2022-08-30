import { axiosApi as axios, NameValueList } from '@nara.platform/accent';
import { ChangeEvent } from 'react';

const BASE_URL = '/api/expert/v1/instructors/file';

export function upload(file: File): Promise<string> | undefined {
  if (file === null) {
    return undefined;
  }

  // if (
  //   file &&
  //   !file.name.toLowerCase().endsWith('.jpg') &&
  //   !file.name.toLowerCase().endsWith('.jpeg') &&
  //   !file.name.toLowerCase().endsWith('.png') &&
  //   !file.name.toLowerCase().endsWith('.gif')
  // ) {
  //   alert('확장자 오류');
  //   return;
  // }

  const formData = new FormData();
  formData.append('file', file);
  /*eslint consistent-return: "off"*/
  return axios.post(BASE_URL, formData).then((r) => r.data);
}

declare global {
  interface Navigator {
    msSaveBlob?: (blob: any, defaultName?: string) => boolean;
  }
}

export function download(downloadPath: string, fileName?: string) {
  // alert("downloadPath:" + downloadPath + "\n" + "fileName:" + fileName);
  if (fileName) {
    axios.get(downloadPath, { responseType: 'blob' }).then(({ data }: any) => {
      const blob = new Blob([data]);

      if (window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(blob, fileName);
      } else {
        const fileURL = window.URL.createObjectURL(blob);
        const fileLink = document.createElement('a');

        fileLink.href = fileURL;
        fileLink.setAttribute('download', fileName);
        fileLink.style.display = 'none';
        document.body.appendChild(fileLink);

        fileLink.click();
        document.body.removeChild(fileLink);
      }
    });
  } else {
    const element = document.createElement('a');
    element.setAttribute('href', downloadPath);
    element.setAttribute('download', 'download');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
}
