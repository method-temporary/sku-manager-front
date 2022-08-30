import { getImagePath } from 'shared/helper';
import { IdName } from 'shared/model';
import { panoptoThumbnailUpload, thumbnailUpload } from '_data/imagesUpload/api/imagesUploadApi';
import CardThumbnailStore from './cardThumbnail.store';

export function getSelectOption(thumbnailIconGroup?: IdName[]) {
  const parsethumbnailIconGroup = [
    {
      key: 'panopto',
      value: 'panopto',
      text: 'panopto thumbnail',
    },
  ];

  if (thumbnailIconGroup) {
    const thumbnailOptions = thumbnailIconGroup.map((item) => {
      return {
        key: item.id,
        value: item.id,
        text: item.name,
      };
    });

    return [...thumbnailOptions, ...parsethumbnailIconGroup];
  }

  return parsethumbnailIconGroup;
}

export function getPanoptoThumbnailUrl(panoptoUrl: string) {
  return `https://sku.ap.panopto.com/Panopto/Services/FrameGrabber.svc/FrameRedirect?objectId=${panoptoUrl}&mode=Delivery&random=0.855699771948019&usePng=False`;
}

export function getThumbnailSetUrl(thumbnailSetUrl: string) {
  return `${getImagePath()}${thumbnailSetUrl}`;
}

export async function getCardThumbnailUrl() {
  const { cardThumbnailRadio, uploadImageFile, thumbnailImageUrl } = CardThumbnailStore.instance;

  if (cardThumbnailRadio === 'upload') {
    const formData = new FormData();
    if (uploadImageFile) {
      formData.append('file', uploadImageFile);
      const result = await thumbnailUpload(formData);

      return result;
    }
  }

  if (thumbnailImageUrl.includes('icon')) {
    return thumbnailImageUrl;
  } else {
    if (thumbnailImageUrl === '') {
      return '';
    }
    if (thumbnailImageUrl.includes('thumb') || thumbnailImageUrl.includes('public')) {
      return thumbnailImageUrl;
    } else {
      const result = await panoptoThumbnailUpload(thumbnailImageUrl);
      return result;
    }
  }
}
