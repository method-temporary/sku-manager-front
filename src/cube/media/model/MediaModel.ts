import { DramaEntityObservableModel } from 'shared/model';
import { MediaContents } from './vo/MediaContents';
import { MediaType } from './vo/MediaType';
import { decorate, observable } from 'mobx';
import { MediaCdoModel } from './old/MediaCdoModel';
import { NameValueList } from 'shared/model';
import { MediaSdo } from './sdo/MediaSdo';

export class MediaModel extends DramaEntityObservableModel {
  //
  mediaType: MediaType = MediaType.InternalMedia;
  name: string = '';
  mediaContents: MediaContents = new MediaContents();

  constructor(media?: MediaModel) {
    super();
    if (media) {
      const mediaContents = new MediaContents(media.mediaContents);
      Object.assign(this, { ...media, mediaContents });
    }
  }

  static asSdo(media: MediaModel): MediaSdo {
    //
    return {
      mediaType: media.mediaType,
      name: media.name,
      mediaContents: media.mediaContents,
    };
  }

  static asCdo(media: MediaModel): MediaCdoModel {
    //
    return {
      audienceKey: 'r2p8-r@nea-m5-c5',
      mediaType: (media.mediaType && media.mediaType) || MediaType.LinkMedia,
      name: media.name,
      mediaContents: media.mediaContents,
    };
  }

  static asNameValues(media: MediaModel): NameValueList {
    const asNameValues = {
      nameValues: [
        {
          name: 'name',
          value: media.name,
        },
        {
          name: 'mediaType',
          value: media.mediaType,
        },
        {
          name: 'mediaContents',
          value: JSON.stringify(media.mediaContents),
        },
      ],
    };
    return asNameValues;
  }

  static isBlank(media: MediaModel): string {
    //
    if (!media.mediaContents) {
      return 'success';
    }

    if (!media.mediaType) return '교육자료를 입력해주세요';

    if (media.mediaType === MediaType.LinkMedia) {
      if (!media.mediaContents.linkMediaUrl) {
        return '외부 영상 url을 입력해주세요';
      } else if (
        !media.mediaContents.linkMediaUrl.includes('http://') &&
        !media.mediaContents.linkMediaUrl.includes('https://')
      ) {
        return '정확한 url을 입력해주세요';
      }
    }
    if (media.mediaType === MediaType.ContentsProviderMedia) {
      if (media.mediaContents.contentsProvider.contentsProviderType.id === 'PVD0000w') {
        if (!media.mediaContents.contentProviderContentId || media.mediaContents.contentProviderContentId === '') {
          return 'Coursera 컨텐츠를 선택해주세요';
        }
      } else if (media.mediaContents.contentsProvider.contentsProviderType.id === 'PVD00010') {
        if (!media.mediaContents.contentProviderContentId || media.mediaContents.contentProviderContentId === '') {
          return 'LinkedIn 컨텐츠를 선택해주세요';
        }
      }

      if (!media.mediaContents.contentsProvider.url) {
        return 'cp 영상 url을 입력해주세요';
      } else if (
        !media.mediaContents.contentsProvider.url.includes('http://') &&
        !media.mediaContents.contentsProvider.url.includes('https://')
      ) {
        return '정확한 url을 입력해주세요';
      }
    }
    if (media.mediaType === MediaType.InternalMedia && !media.mediaContents.internalMedias.length) {
      return '내부 영상을 선택해주세요';
    }
    if (media.mediaContents.linkMediaUrl && media.mediaContents.linkMediaUrl.indexOf('sku.ap.panopto.com') !== -1) {
      return 'sku.ap.panopto.com 동영상은 “교육자료” 항목에서 “내부 영상”을 선택하여 “동영상 선택” 버튼을 통해 등록해주시기 바랍니다.';
    }
    if (
      media.mediaContents.contentsProvider &&
      media.mediaContents.contentsProvider.url.indexOf('sku.ap.panopto.com') !== -1
    ) {
      return 'sku.ap.panopto.com 동영상은 “교육자료” 항목에서 “내부 영상”을 선택하여 “동영상 선택” 버튼을 통해 등록해주시기 바랍니다.';
    }
    // 2021-06-11 긴급 배포로 인한 롤백
    if (
      media.mediaType === MediaType.InternalMedia &&
      media.mediaContents.internalMedias.filter((media) => media.duration === 0).length > 0
    ) {
      return '동영상 재생시간이 없습니다.  새로고침 후 다시 등록해주세요.';
    }
    return 'success';
  }
}

decorate(MediaModel, {
  mediaType: observable,
  name: observable,
  mediaContents: observable,
});
