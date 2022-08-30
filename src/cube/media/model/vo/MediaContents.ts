import { decorate, observable } from 'mobx';
import { InternalMediaConnectionModel } from '../old/InternalMediaConnectionModel';
import { ContentsProvider } from './ContentsProvider';

export class MediaContents {
  //
  contentProviderContentId: string = '';
  contentsProvider: ContentsProvider = new ContentsProvider();
  internalMedias: InternalMediaConnectionModel[] = [];
  linkMediaUrl: string = '';

  constructor(mediaContents?: MediaContents) {
    if (mediaContents) {
      const contentsProvider = new ContentsProvider(mediaContents.contentsProvider);
      const internalMedias =
        mediaContents.internalMedias &&
        mediaContents.internalMedias.map((internalMedia) => new InternalMediaConnectionModel(internalMedia));
      Object.assign(this, { ...mediaContents, contentsProvider, internalMedias });
    }
  }
}

decorate(MediaContents, {
  contentProviderContentId: observable,
  contentsProvider: observable,
  internalMedias: observable,
  linkMediaUrl: observable,
});
