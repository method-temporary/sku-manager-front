import { computed, decorate, observable } from 'mobx';
import moment from 'moment';
import { DramaEntity, PatronKey, PatronType } from '@nara.platform/accent';
import { LangStrings, IdName } from 'shared/model';
import { CommentXlsxModel } from './CommentXlsxModel';
import { EmbeddedSubCommentListModel } from './EmbeddedSubCommentListModel';

export class CommentModel implements DramaEntity {
  //
  id: string = '';
  entityVersion: number = 0;
  patronKey: PatronKey = { keyString: '', patronType: PatronType.Cineroom };

  names: LangStrings = new LangStrings();
  message: string = '';
  important: boolean = false;
  time: number = 0;
  feedbackId: string = '';

  subCommentCount: number = 0;
  embeddedSubComments: EmbeddedSubCommentListModel = new EmbeddedSubCommentListModel(); // optional

  deleted: boolean = false;
  deletedTime: number = 0;
  deleter: IdName = {} as IdName;
  base64AttachedImage: string = '';

  //only viewing
  expanded: boolean = false;
  shorted: boolean = true;
  editable: boolean = false;

  changeMessage: string = '';
  changeBase64AttachedImage: string = '';

  companyName: string = '';
  departmentName: string = '';
  email: string = '';

  displayName?: string = '';

  constructor(comment?: CommentModel) {
    if (comment) {
      const names = (comment.names && new LangStrings(comment.names)) || this.names;
      const embeddedSubComments =
        (comment.embeddedSubComments && new EmbeddedSubCommentListModel(comment.embeddedSubComments)) ||
        this.embeddedSubComments;
      Object.assign(this, { ...comment, names, embeddedSubComments });
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
    return (this.deleter && this.deleter.name) || '';
  }

  static asXLSX(comment: CommentModel, index: number): CommentXlsxModel {
    //
    return {
      No: String(index + 1),
      소속사: comment.companyName || '-',
      '소속조직(팀)': comment.departmentName || '-',
      작성자: comment.displayName || '-',
      Email: comment.email || '-',
      댓글내용: comment.message || '-',
      등록일: moment(comment.time).format('YYYY.MM.DD') || '-',
      댓글상태: comment.deleted === true ? '삭제' : '정상',
      댓글관리: comment.deleted === true ? '삭제 | ' + comment.deletedTimeString + ' | ' + comment.deleterName : '-',
    };
  }
}

decorate(CommentModel, {
  id: observable,
  entityVersion: observable,
  patronKey: observable,
  names: observable,
  message: observable,
  time: observable,
  important: observable,
  feedbackId: observable,
  deleted: observable,
  deletedTime: observable,
  deleter: observable,
  base64AttachedImage: observable,
  expanded: observable,
  shorted: observable,
  editable: observable,
  changeMessage: observable,
  changeBase64AttachedImage: observable,
  companyName: observable,
  departmentName: observable,
  email: observable,
  displayName: observable,
});
