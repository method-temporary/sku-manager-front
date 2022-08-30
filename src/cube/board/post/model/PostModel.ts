import { DomainEntity } from '@nara.platform/accent';
import { computed, decorate, observable } from 'mobx';
import moment from 'moment';
import { PolyglotModel, NewDatePeriod, PatronKey, NameValueList, IdName } from 'shared/model';
import {
  getDefaultLanguage,
  getPolyglotToAnyString,
  isPolyglotBlank,
  LangSupport,
  langSupportCdo,
  DEFAULT_LANGUAGE,
} from 'shared/components/Polyglot';

import { PostContentsModel } from './PostContentsModel';
import { PostConfigModel } from './PostCofigModel';
import { OpenState } from './OpenState';
import { WriterModel } from './WriterModel';
import { PostCdo } from './PostCdo';
import { PostListViewXlsxModel } from './PostListViewXlsxModel';
import { AnswerModel } from './AnswerModel';
import { IdPolyglot } from './IdPolyglot';
import { PostCloseOption } from './PostCloseOption';

export class PostModel implements DomainEntity {
  //
  id: string = '';
  entityVersion: number = 0;

  postId: string = '';
  title: PolyglotModel = new PolyglotModel();
  writer: WriterModel = new WriterModel();
  contents: PostContentsModel = new PostContentsModel();
  time: number = 0;
  readCount: number = 0;
  config: PostConfigModel = new PostConfigModel();
  category: IdPolyglot = new IdPolyglot();
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

  attendDate: string = '';
  companyName: string = '';
  departmentName: string = '';
  email: string = '';
  mobileApp: boolean = false;
  name: PolyglotModel = new PolyglotModel();
  registeredTime: number = 0;

  langSupports: LangSupport[] = [DEFAULT_LANGUAGE];

  closeOption: PostCloseOption = PostCloseOption.NotToday;

  constructor(post?: PostModel) {
    //
    if (post) {
      const writer = (post.writer && new WriterModel(post.writer)) || this.writer;
      const contents = (post.contents && new PostContentsModel(post.contents)) || this.contents;
      const config = (post.config && new PostConfigModel(post.config)) || this.config;
      const category = (post.category && new IdPolyglot(post.category)) || this.category;
      const answer = (post.answer && new IdName(post.answer)) || this.answer;
      const openState = (post.openState && post.openState) || OpenState.Created;
      const period = (post.period && new NewDatePeriod(post.period)) || new NewDatePeriod();
      const title = (post.title && new PolyglotModel(post.title)) || this.title;
      const name = (post.name && new PolyglotModel(post.name)) || this.name;
      const langSupports = post.langSupports && post.langSupports.map((target) => new LangSupport(target));
      const closeOption = post.closeOption || PostCloseOption.NotToday;

      Object.assign(this, {
        ...post,
        writer,
        contents,
        config,
        openState,
        category,
        period,
        answer,
        title,
        name,
        langSupports,
        closeOption,
      });
    }
  }

  @computed
  get createdTime() {
    //
    return moment(this.registeredTime).format('YYYY.MM.DD HH:mm:ss');
  }

  @computed
  get answeredTime() {
    //
    return moment(this.answerUpdatedAt).format('YYYY.MM.DD HH:mm:ss');
  }

  static isBlank(post: PostModel): string {
    //
    if (!post.category.id) return '카테고리는 필수입력 항목입니다.';
    if (isPolyglotBlank(post.langSupports, post.title)) return '제목은 필수입력 항목입니다.';
    // if (!post.writer.employeeId) return 'POC';
    if (post.contents.contents.length === 0 || isPolyglotBlank(post.langSupports, post.contents.contents[0].contents))
      return '내용은 필수입력 항목입니다.';
    if (post.pinned === null) return '공지구분은 필수입력 항목입니다.';
    if (post.pinned && !post.period) return '기간은 필수입력 항목입니다.';
    return 'success';
  }

  static isBlankForNotice(post: PostModel): string {
    //
    if (isPolyglotBlank(post.langSupports, post.title)) return '제목은 필수입력 항목입니다.';
    // if (isPolyglotBlank(post.langSupports, post.contents.contents)) return '내용은 필수입력 항목입니다.';
    if (post.pinned === null) return '공지구분은 필수입력 항목입니다.';
    if (post.pinned && !post.period) return '기간은 필수입력 항목입니다.';
    if (post.pinned && !post.closeOption) return '닫기 옵션은 필수입력 항목입니다.';
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

      registeredTime: post.registeredTime,

      langSupports: langSupportCdo(post.langSupports),
      closeOption: post.closeOption,
    };
  }

  static asCallCdo(post: PostModel): any {
    return {
      audienceKey: '',
      boardId: post.boardId && post.boardId,
      title: post.title && post.title,
      writer: post.writer && post.writer,
      contents: post.contents && post.contents,
      config: post.config && post.config,
      category: post.category && post.category,
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
          value: JSON.stringify(post.title),
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
          name: 'pinned',
          value: String(post.pinned),
        },
        {
          name: 'period',
          value: JSON.stringify(period),
        },
        {
          name: 'commentFeedbackId',
          value: post.commentFeedbackId,
        },
        {
          name: 'langSupports',
          value: JSON.stringify(langSupportCdo(post.langSupports)),
        },
        {
          name: 'closeOption',
          value: post.closeOption,
        },
      ],
    };
    return asNameValues;
  }

  static getAnsweredType(qna: PostModel) {
    if (qna && qna.answered && qna.answerUpdatedAt !== 0) {
      return '답변완료';
    }
    if (qna.answered) {
      return '답변대기';
    }
    if (qna && !qna.answered) {
      return '답변대기';
    }

    return '-';
  }

  static asXLSX(qna: PostModel, index: number): PostListViewXlsxModel {
    return {
      No: String(index + 1),
      카테고리: getPolyglotToAnyString(qna.category.name, getDefaultLanguage(qna.langSupports)) || '-',
      제목: getPolyglotToAnyString(qna.title, getDefaultLanguage(qna.langSupports)) || '-',
      등록일자: moment(qna.registeredTime).format('YYYY.MM.DD HH:mm:ss') || '-',
      작성자: getPolyglotToAnyString(qna.writer.name, getDefaultLanguage(qna.langSupports)) || '-',
      소속사: getPolyglotToAnyString(qna.writer.companyName, getDefaultLanguage(qna.langSupports)) || '-',
      Email: qna.writer.email || '-',
      처리상태: this.getAnsweredType(qna),
    };
  }

  static attendXLSX(attend: PostModel, index: number) {
    return {
      No: String(index + 1),
      소속사: attend.companyName || '-',
      '소속 조직(팀)': attend.departmentName || '-',
      성명: attend.name || '-',
      Email: attend.email || '-',
      참여일: attend.attendDate || '-',
      출석시간: moment(attend.time).format('YYYY.MM.DD HH:mm:ss') || '-',
      모바일: attend.mobileApp ? 'O' : '',
    };
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

  registeredTime: observable,
  langSupports: observable,
  mobileApp: observable,
  closeOption: observable,
});
