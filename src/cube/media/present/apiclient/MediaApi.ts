import { axiosApi as axios } from 'shared/axios/Axios';
import { OffsetElementList } from 'shared/model';

import { PanoptoCdoModel } from '../../model/old/PanoptoCdoModel';
import { InternalMediaConnectionModel } from '../../model/old/InternalMediaConnectionModel';
import { MediaModel } from '../../model/MediaModel';

export default class MediaApi {
  URL = '/api/cube/medias';

  static instance: MediaApi;

  registerMedia(media: MediaModel) {
    return axios.post<string>(this.URL, media).then((response) => (response && response.data) || null);
  }

  findMedia(mediaId: string) {
    //
    return axios.get<MediaModel>(this.URL + `/${mediaId}`).then((response) => (response && response.data) || null);
  }

  findPanoptoList(panoptoCdo: PanoptoCdoModel) {
    //
    return axios
      .get<OffsetElementList<InternalMediaConnectionModel>>(this.URL + `/panoptos`, { params: panoptoCdo })
      .then(
        (response) =>
          (response && response.data && new OffsetElementList<InternalMediaConnectionModel>(response.data)) ||
          new OffsetElementList<InternalMediaConnectionModel>()
      );
  }

  // findPanoptoListByFileName(fileName: string) {
  //   //
  //   return axios.get<OffsetElementList<InternalMediaConnectionModel>>(this.URL + `/panoptos/${fileName}`)
  //     .then(response => response && response.data && response.data.totalCount > 0
  //       && new OffsetElementList<InternalMediaConnectionModel>(response.data)
  //       || new OffsetElementList<InternalMediaConnectionModel>());
  // }
}

Object.defineProperty(MediaApi, 'instance', {
  value: new MediaApi(),
  writable: false,
  configurable: false,
});
