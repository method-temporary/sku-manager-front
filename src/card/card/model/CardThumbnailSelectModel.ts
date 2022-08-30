export type CardThumbnailSelectRadio = 'thumbnailSet' | 'upload';

export interface CubeIdWithPanoptoSessionId {
  checked: boolean;
  cubeId: string;
  panoptoSessionId: string;
}

export interface ThumbnailSelect {
  key: string;
  value: string;
  text: string;
}

export interface UploadThumbnail {
  uploadThumbnailFile: File;
  uploadThumbnailDataUrl: string;
}

export interface ThumbnailSet {
  checked: boolean;
  url: string;
}

export interface CardThumbnailSelect {
  thumbnailImageUrl: string;
  selectRadio: CardThumbnailSelectRadio;
  uploadThumbnail: UploadThumbnail;
  panoptoThumbnails: CubeIdWithPanoptoSessionId[];
  thumbnailSelectOptions: ThumbnailSelect[];
}
