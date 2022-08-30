import { computed, decorate, observable } from 'mobx';
import moment from 'moment';
import { DramaEntity, PatronKey, PatronType } from '@nara.platform/accent';
import { IdName, LangStrings } from 'shared/model';

export class SubCommentModel implements DramaEntity {
  //
  id: string = '';
  entityVersion: number = 0;
  patronKey: PatronKey = { keyString: '', patronType: PatronType.Audience };

  message: string = '';
  names: LangStrings = new LangStrings();
  time: number = 0;

  commentId: string = '';

  deleted: boolean = false;
  deletedTime: number = 0;
  deleter: IdName = {} as IdName;
  base64AttachedImage: string = '';

  //only viewing
  shorted: boolean = true;
  editable: boolean = false;

  changeMessage: string = '';
  changeBase64AttachedImage: string = '';

  constructor(comment?: SubCommentModel) {
    if (comment) {
      const names = (comment.names && new LangStrings(comment.names)) || this.names;
      Object.assign(this, { ...comment, names });
      this.changeMessage = comment.message;
      this.changeBase64AttachedImage = comment.base64AttachedImage;
    }
  }

  @computed
  get writerId() {
    return this.patronKey.keyString || '';
  }

  @computed
  get writerName() {
    return this.names.langStringMap.get(this.names.defaultLanguage) || '';
  }

  @computed
  get timeString() {
    return (this.time && moment(this.time).format('YYYY.MM.DD')) || '-';
  }

  @computed
  get deletedTimeString() {
    return (this.deletedTime && moment(this.deletedTime).format('YYYY.MM.DD')) || '-';
  }

  @computed
  get deleterName() {
    return this.deleter.name || '';
  }
}

decorate(SubCommentModel, {
  id: observable,
  entityVersion: observable,
  patronKey: observable,
  message: observable,
  names: observable,
  time: observable,
  commentId: observable,
  deleted: observable,
  deletedTime: observable,
  deleter: observable,
  base64AttachedImage: observable,
  shorted: observable,
  editable: observable,
  changeMessage: observable,
  changeBase64AttachedImage: observable,
});
