import { MediaContents } from '../vo/MediaContents';
import { MediaType } from '../vo/MediaType';

export class MediaCdoModel {
  //
  audienceKey: string = 'r2p8-r@nea-m5-c5';
  mediaType: MediaType = MediaType.ContentsProviderMedia;
  name: string = '';
  mediaContents: MediaContents = new MediaContents();
  // learningPeriod: NewDatePeriod = new NewDatePeriod();
}
