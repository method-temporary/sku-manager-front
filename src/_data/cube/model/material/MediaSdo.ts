import { MediaContents } from './MediaContents';
import { MediaType } from './MediaType';
import { Media } from './Media';

export interface MediaSdo {
  mediaContents: MediaContents;
  mediaType: MediaType;
  name: string;
}

function fromMedia(media: Media): MediaSdo {
  return {
    ...media,
  };
}

export const MediaSdoFunc = { fromMedia };
