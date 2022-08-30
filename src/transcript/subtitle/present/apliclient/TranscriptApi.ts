import { axiosApi as axios } from 'shared/axios/Axios';

import { NameValueList, OffsetElementList } from 'shared/model';

import { TranscriptModel } from '../../model/TranscriptModel';
import { TranscriptCdoModel } from '../../model/TranscriptCdoModel';

export default class TranscriptApi {
  URL = '/api/cube/transcripts';

  static instance: TranscriptApi;

  registerTranscript(transcriptCdo: TranscriptCdoModel[]) {
    return axios.post(this.URL, transcriptCdo).then((response) => (response && response.data) || null);
  }

  findAllTranscript(deliveryId: string, locale: string) {
    return axios
      .get<TranscriptModel[]>(`${this.URL}/${deliveryId}/${locale}`)
      .then((response) => response && response.data);
  }

  // 관리 팝업 리스트 조회
  findTranscriptList(deliveryId: string, locale: string, offset: number, limit: number) {
    return axios
      .get<OffsetElementList<TranscriptModel>>(this.URL + `/findTranscriptList`, {
        params: { deliveryId, limit, locale, offset },
      })
      .then(
        (response) =>
          (response && response.data && new OffsetElementList<TranscriptModel>(response.data)) ||
          new OffsetElementList<TranscriptModel>()
      );
  }

  findTranscript(Id: string) {
    return axios.get<TranscriptModel>(`${this.URL}/${Id}`).then((response) => response && response.data);
  }

  modifyTranscript(Id: string, nameValues: NameValueList) {
    return axios.put(this.URL + `/${Id}`, nameValues).then((response) => (response && response.data) || null);
  }

  removeTranscript(Id: string) {
    return axios.put(this.URL + `/${Id}`).then((response) => (response && response.data) || null);
  }

  srtUpload(sessionId: string, file: File, locale: string) {
    const formData = new FormData();
    formData.append('file', file);

    return axios
      .post(this.URL + `/srtUpload?sessionId=${sessionId}&locale=${locale}`, formData)
      .then((response) => (response && response.data) || null);
  }

  removeTranscriptByDeliveryIdLocale(sessionId: string, locale: string) {
    return axios.delete(this.URL + `/${sessionId}/${locale}`).then((response) => (response && response.data) || null);
  }

  // fileDownload = (url: string) => {
  //   return axios
  //     .request({
  //       url,
  //       method: 'get',
  //       responseType: 'blob', //important
  //     })
  //     .then(({ data, headers }) => {
  //       let filename = "";
  //       const disposition = headers['content-disposition'];
  //       if (disposition && disposition.indexOf('attachment') !== -1) {
  //         const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
  //         const matches = filenameRegex.exec(disposition);
  //         if (matches != null && matches[1]) {
  //           filename = matches[1].replace(/['"]/g, '');
  //         }
  //       }
  //       const downloadUrl = window.URL.createObjectURL(new Blob([data]));
  //       const link = document.createElement('a');
  //       link.href = downloadUrl;
  //       link.setAttribute('download', 'transcript_upload_sample.srt'); //any other extension
  //       document.body.appendChild(link);
  //       link.click();
  //       // link.remove();
  //     });
  // }
}

Object.defineProperty(TranscriptApi, 'instance', {
  value: new TranscriptApi(),
  writable: false,
  configurable: false,
});
