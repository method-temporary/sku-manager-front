import { action, configure, observable, runInAction } from 'mobx';
import autobind from 'autobind-decorator';
import _ from 'lodash';
import { Offset, OffsetElementList } from '@nara.platform/accent';
import CommentApi from '../apiclient/CommentApi';
import { CommentModel } from '../../model/CommentModel';
import { SubCommentModel } from '../../model/SubCommentModel';
import { CommentOffset } from '../../model/CommentOffset';
import { FeedbackCdo } from '../../model/FeedbackCdo';
import { PageModel } from 'shared/model';

configure({
  enforceActions: 'observed',
});

@autobind
export default class CommentService {
  //
  static instance: CommentService;

  commentApi: CommentApi;

  @observable
  comments: OffsetElementList<CommentModel> = { results: [], totalCount: 0 };

  @observable
  commentsForExcel: CommentModel[] = [];

  @observable
  commentOffset: CommentOffset = new CommentOffset();

  @observable
  subCommentsMap: Map<string, OffsetElementList<SubCommentModel>> = new Map();

  @observable
  subCommentOffsetMap: Map<string, Offset> = new Map();

  constructor(commentApi: CommentApi) {
    this.commentApi = commentApi;
  }

  @action
  async findComments(pageModel: PageModel) {
    const comments = await this.commentApi.findComments(CommentOffset.asCommentRdo(this.commentOffset, pageModel));
    comments.results = comments.results.map((comment) => new CommentModel(comment));
    runInAction(() => (this.comments = comments));
  }

  @action
  async findCommentsForExcel() {
    const comments = await this.commentApi.findCommentsForExcel(
      CommentOffset.asCommentRdo(this.commentOffset, new PageModel(0, 99999))
    );
    //comments = comments.map(comment => new CommentModel(comment));
    runInAction(() => (this.commentsForExcel = comments));
    return comments;
  }

  @action
  setCommentOffset(name: string, value: any) {
    this.commentOffset = _.set(this.commentOffset, name, value);
  }

  @action
  setCommentsProp(commentId: string, name: string, value: any) {
    const index = this.comments.results.findIndex((comment) => comment.id === commentId);
    this.comments.results[index] = _.set(this.comments.results[index], name, value);
  }

  @action
  setAllCommentsProp(name: string, values: any[]) {
    this.comments.results.map((result, index) => ((result as any)[name] = values[index]));
  }

  @action
  async findSubComments(commentId: string, offset: Offset) {
    const subComments = await this.commentApi.findSubComments(commentId, offset.offset, offset.limit);
    subComments.results = subComments.results.map((subComment) => new SubCommentModel(subComment));
    runInAction(() => this.subCommentsMap.set(commentId, subComments));
  }

  @action
  setSubCommentOffset(commentId: string, name: string, value: number) {
    let subCommentOffset = this.subCommentOffsetMap.get(commentId);
    if (!subCommentOffset) subCommentOffset = { offset: 0, limit: 10 };
    subCommentOffset = _.set(subCommentOffset, name, value);
    this.subCommentOffsetMap.set(commentId, subCommentOffset);
  }

  @action
  initSubCommentOffset(commentId: string) {
    this.subCommentOffsetMap.set(commentId, { offset: 0, limit: 10 });
  }

  removeComment(commentId: string) {
    return this.commentApi.removeComment(commentId);
  }

  removeSubComment(commentId: string, subCommentId: string | number) {
    return this.commentApi.removeSubComment(commentId, subCommentId);
  }

  getCommentFeedbackId(feedbackCdo: FeedbackCdo) {
    return this.commentApi.registerCommentFeedback(feedbackCdo);
  }

  @action
  changeCommentsProp(index: number, name: string, value: any) {
    //
    this.comments = _.set(this.comments, `results[${index}].${name}`, value);
  }

  @action
  changeCommentsForExcelProp(index: number, name: string, value: any) {
    //
    this.commentsForExcel = _.set(this.commentsForExcel, `[${index}].${name}`, value);
  }
}

Object.defineProperty(CommentService, 'instance', {
  value: new CommentService(CommentApi.instance),
  writable: false,
  configurable: false,
});
