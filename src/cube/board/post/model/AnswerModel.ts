import { decorate, observable } from 'mobx';

import { DomainEntity } from '@nara.platform/accent';

import { NameValueList } from 'shared/model';
import { isPolyglotEmpty } from 'shared/components/Polyglot';

import { PostModel } from './PostModel';
import { WriterModel } from './WriterModel';
import { PostContentsModel } from './PostContentsModel';
import { AnswerContentsModel } from './AnswerContentsModel';

export class AnswerModel implements DomainEntity {
  //
  id: string = '';
  entityVersion: number = 0;

  postId: string = '';
  writer: WriterModel = new WriterModel();
  updater: WriterModel = new WriterModel();
  writtenTime: number = 0;
  updateTime: number = 0;
  title: string = '';
  contents: AnswerContentsModel = new AnswerContentsModel();
  answerId: string = '';
  commentFeedbackId: string = '';

  constructor(answer?: AnswerModel) {
    //
    if (answer) {
      const writer = (answer.writer && new WriterModel(answer.writer)) || this.writer;
      const updater = (answer.updater && new WriterModel(answer.updater)) || this.updater;
      //const registeredTime = new Date(answer.registeredTime).toLocaleDateString();
      const contents = (answer.contents && new AnswerContentsModel(answer.contents)) || this.contents;

      Object.assign(this, { ...answer, writer, updater, contents });
    }
  }

  static isBlank(post: PostModel, answer: AnswerModel): string {
    if (!answer.title) return '제목';
    if (isPolyglotEmpty(answer.contents.contents)) return '내용';
    return 'success';
  }

  static asNameValuesList(answer: AnswerModel): NameValueList {
    const asNameValues = {
      nameValues: [
        {
          name: 'title',
          value: answer.title,
        },
        {
          name: 'contents',
          value: JSON.stringify(answer.contents),
        },
        {
          name: 'updater',
          value: JSON.stringify(answer.updater),
        },
        {
          name: 'modifiedTime',
          value: String(Date.now()),
        },
        {
          name: 'commentFeedbackId',
          value: String(answer.commentFeedbackId),
        },
      ],
    };

    return asNameValues;
  }
}

decorate(AnswerModel, {
  id: observable,
  entityVersion: observable,

  postId: observable,
  writer: observable,
  updater: observable,
  writtenTime: observable,
  updateTime: observable,
  title: observable,
  contents: observable,
  answerId: observable,
  commentFeedbackId: observable,
});
