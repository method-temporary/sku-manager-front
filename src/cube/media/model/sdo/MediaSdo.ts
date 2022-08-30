import { MediaType } from '../vo/MediaType';
import { MediaContents } from '../vo/MediaContents';
import { decorate, observable } from 'mobx';

export class MediaSdo {
  //
  mediaType: MediaType = MediaType.ContentsProviderMedia;
  name: string = '';
  mediaContents: MediaContents = new MediaContents();

  constructor(mediaSdo?: MediaSdo) {
    if (mediaSdo) {
      const mediaContents = new MediaContents(mediaSdo.mediaContents);
      Object.assign(this, { ...mediaSdo, mediaContents });
    }
  }
}

decorate(MediaSdo, {
  mediaType: observable,
  name: observable,
  mediaContents: observable,
});
