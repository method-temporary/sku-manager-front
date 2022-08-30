import { computed, decorate, observable } from 'mobx';
import moment from 'moment';
import { AudienceKey, PatronType } from '@nara.platform/accent';
import { LangStrings } from 'shared/model';

export class EmbeddedSubCommentModel {
  //
  patronKey: AudienceKey = { keyString: '', patronType: PatronType.Audience };
  message: string = '';
  names: LangStrings = new LangStrings();
  time: number = 0;

  deleted: boolean = false;
  base64AttachedImage: string = '';

  //only viewing
  shorted: boolean = true;
  editable: boolean = false;
  changeMessage: string = '';
  changeBase64AttachedImage: string = '';

  constructor(comment?: EmbeddedSubCommentModel) {
    if (comment) {
      const names = (comment.names && new LangStrings(comment.names)) || this.names;
      Object.assign(this, { ...comment, names });
      this.changeMessage = comment.message;
      this.changeBase64AttachedImage = comment.base64AttachedImage;
    }
  }

  @computed
  get timeString() {
    return (this.time && moment(this.time).format('YYYY.MM.DD')) || '-';
  }

  @computed
  get writerId() {
    return this.patronKey.keyString || '';
  }

  @computed
  get writerName() {
    return this.names.langStringMap.get(this.names.defaultLanguage) || '';
  }
}

decorate(EmbeddedSubCommentModel, {
  patronKey: observable,
  message: observable,
  names: observable,
  time: observable,
  deleted: observable,
  base64AttachedImage: observable,
  shorted: observable,
  editable: observable,
  changeMessage: observable,
  changeBase64AttachedImage: observable,
});
