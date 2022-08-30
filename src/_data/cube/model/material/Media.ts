import { getInitMediaContents, MediaContents } from './MediaContents';
import { MediaType } from './MediaType';
import { DramaEntity } from '@nara.platform/accent';
import { PatronKey } from '../../../../shared/model';

export interface Media extends DramaEntity {
  contentProviderContentId: string;
  mediaContents: MediaContents;
  mediaType: MediaType;
  name: string;
}

export function getInitMedia(): Media {
  //
  return {
    contentProviderContentId: '',
    mediaContents: getInitMediaContents(),
    mediaType: '',
    name: '',
    id: '',
    patronKey: new PatronKey(),
    entityVersion: 0,
  };
}
