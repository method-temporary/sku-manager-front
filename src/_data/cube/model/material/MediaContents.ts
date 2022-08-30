import { ContentsProvider, getInitContentsProvider } from './ContentsProvider';
import { InternalMediaConnection } from './InternalMediaConnection';

export interface MediaContents {
  contentProviderContentId: string;
  contentsProvider: ContentsProvider;
  internalMedias: InternalMediaConnection[];
  linkMediaUrl: string;
}

export function getInitMediaContents(): MediaContents {
  //
  return {
    contentProviderContentId: '',
    contentsProvider: getInitContentsProvider(),
    internalMedias: [],
    linkMediaUrl: '',
  };
}
