import { computed, decorate, observable } from 'mobx';
import moment from 'moment';

import { DomainEntity } from '@nara.platform/accent';

import { IdName, NameValueList, PatronKey, NewDatePeriod } from 'shared/model';

import { WriterModel } from '../../../cube/board/post/model/WriterModel';
import { PostContentsModel } from './PostContentsModel';
import { PostConfigModel } from './PostCofigModel';
import { OpenState } from './OpenState';
import { PostCdo } from './PostCdo';

export default class PostModel implements DomainEntity {
  //
  id: string = '';
  entityVersion: number = 0;

  postId: string = '';
  title: string = '';
  writer: WriterModel = new WriterModel();
  contents: PostContentsModel = new PostContentsModel();
  time: number = 0;
  readCount: number = 0;
  config: PostConfigModel = new PostConfigModel();
  category: IdName = new IdName();
  boardId: string = '';
  pinned: boolean = false;
  deleted: boolean = false;
  answered: boolean = false;
  answeredAt: number = 0;
  answerUpdatedAt: number = 0;
  answer: IdName = new IdName();
  openState: OpenState = OpenState.Created;
  commentFeedbackId: string = '';

  period: NewDatePeriod = new NewDatePeriod();

  patronKey: PatronKey = {} as PatronKey;

  constructor(post?: PostModel) {
    //
    if (post) {
      const writer = (post.writer && new WriterModel(post.writer)) || this.writer;
      const contents = (post.contents && new PostContentsModel(post.contents)) || this.contents;
      const config = (post.config && new PostConfigModel(post.config)) || this.config;
      const category = (post.category && new IdName(post.category)) || this.category;
      const answer = (post.answer && new IdName(post.answer)) || this.answer;
      const openState = (post.openState && post.openState) || OpenState.Created;
      const period = (post.period && new NewDatePeriod(post.period)) || new NewDatePeriod();

      Object.assign(this, {
        ...post,
        writer,
        contents,
        config,
        openState,
        category,
        period,
        answer,
      });
    }
  }

  @computed
  get createdTime() {
    //
    return moment(this.time).format('YYYY.MM.DD HH:mm:ss');
  }

  @computed
  get answeredTime() {
    //
    return moment(this.answerUpdatedAt).format('YYYY.MM.DD HH:mm:ss');
  }

  static isBlank(post: PostModel): string {
    //
    if (!post.title) return '제목';
    if (!post.contents) return '내용';
    if (post.pinned === null) return '공지구분';
    if (post.pinned && !post.period) return '기간';
    if (!post.category) return '카테고리';
    return 'success';
  }

  static isBlankForNotice(post: PostModel): string {
    //
    if (!post.title) return '제목';
    if (!post.contents) return '내용';
    if (post.pinned === null) return '공지구분';
    if (post.pinned && !post.period) return '기간';
    return 'success';
  }

  static asCdo(post: PostModel): PostCdo {
    const period = new NewDatePeriod();
    period.startDate = post.period.startDateMoment.format('YYYY-MM-DD');
    period.endDate = post.period.endDateMoment.format('YYYY-MM-DD');
    return {
      id: post.id,
      entityVersion: post.entityVersion,

      postId: post.postId,
      title: post.title,
      writer: post.writer,
      contents: post.contents,
      time: post.time,
      readCount: post.readCount,
      config: post.config,
      category: post.category,
      boardId: post.boardId,
      pinned: post.pinned,
      deleted: post.deleted,
      answered: post.answered,
      answeredAt: post.answeredAt,
      answerUpdatedAt: post.answerUpdatedAt,
      answer: post.answer,
      openState: post.openState,
      commentFeedbackId: post.commentFeedbackId,

      period,

      patronKey: post.patronKey,
    };
  }

  static asNameValueList(post: PostModel): NameValueList {
    const period = new NewDatePeriod();
    period.startDate = post.period.startDateMoment.format('YYYY-MM-DD');
    period.endDate = post.period.endDateMoment.format('YYYY-MM-DD');
    const asNameValues = {
      nameValues: [
        {
          name: 'title',
          value: post.title,
        },
        {
          name: 'category',
          value: JSON.stringify(post.category),
        },
        {
          name: 'contents',
          value: JSON.stringify(post.contents),
        },
        {
          name: 'deleted',
          value: String(post.deleted),
        },
        {
          name: 'openState',
          value: post.openState,
        },
        {
          name: 'writer',
          value: JSON.stringify(post.writer),
        },
        {
          name: 'answered',
          value: String(post.answered),
        },
        {
          name: 'answeredAt',
          value: String(post.answeredAt),
        },
        {
          name: 'answerUpdatedAt',
          value: String(post.answerUpdatedAt),
        },
        {
          name: 'pinned',
          value: String(post.pinned),
        },
        {
          name: 'answer',
          value: JSON.stringify(post.answer),
        },
        {
          name: 'period',
          value: JSON.stringify(period),
        },
        {
          name: 'commentFeedbackId',
          value: post.commentFeedbackId,
        },
      ],
    };
    return asNameValues;
  }
}

decorate(PostModel, {
  id: observable,
  entityVersion: observable,

  postId: observable,
  title: observable,
  writer: observable,
  contents: observable,
  time: observable,
  readCount: observable,
  config: observable,
  category: observable,
  boardId: observable,
  pinned: observable,
  deleted: observable,
  answered: observable,
  answeredAt: observable,
  answerUpdatedAt: observable,
  answer: observable,
  openState: observable,
  period: observable,
  commentFeedbackId: observable,
});
