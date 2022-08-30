import { IdName } from '@nara.platform/accent';

export interface ContentsProvider {
  contentsProviderType: IdName;
  expiryDate: string;
  url: string;
}

export function getInitContentsProvider(): ContentsProvider {
  //
  return {
    contentsProviderType: { id: '', name: '' },
    expiryDate: '',
    url: '',
  };
}
