import { action, observable } from 'mobx';

interface CardThumbnailState {}

export type CardThumbnailRadio = 'thumbnailSet' | 'upload';

class CardThumbnailStore {
  static instance: CardThumbnailStore;

  @observable
  cardThumbnailRadio: CardThumbnailRadio = 'thumbnailSet';

  @observable
  thumbnailImageUrl: string = '';

  @observable
  uploadImageUrl: string = '';

  @observable
  uploadImageFile?: File = undefined;

  @action.bound
  setCardThumbnailRadio(cardThumbnailRadio: CardThumbnailRadio) {
    this.cardThumbnailRadio = cardThumbnailRadio;
  }

  @action.bound
  setThumbnailImageUrl(url: string) {
    this.thumbnailImageUrl = url;
  }

  @action.bound
  setUploadImageUrl(url: string) {
    this.uploadImageUrl = url;
  }

  @action.bound
  setUploadImageFile(file?: File) {
    this.uploadImageFile = file;
  }

  @action.bound
  initCardThumbnaelState() {
    this.setCardThumbnailRadio('thumbnailSet');
    this.setThumbnailImageUrl('');
    this.setUploadImageUrl('');
    this.setUploadImageFile(undefined);
  }
}

CardThumbnailStore.instance = new CardThumbnailStore();
export default CardThumbnailStore;
