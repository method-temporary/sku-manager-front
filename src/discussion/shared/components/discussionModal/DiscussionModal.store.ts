import { action, observable } from 'mobx';
import { PolyglotModel } from 'shared/model';
import { RelatedUrl, RelatedUrlFunc } from '_data/cube/model/material';
import { CardDiscussion } from '_data/lecture/cards/model/CardDiscussion';
import { findCommentsByRdo } from '../../../../_data/feedback/api/CommentApi';
import { CommentRdoFunc } from '../../../../_data/feedback/model/CommentRdo';
import { CommentQueryModelFunc } from '../../../../_data/feedback/model/CommentQueryModel';

class DiscussionModalStore {
  //
  static instance: DiscussionModalStore;

  @observable
  id: string = '';

  @observable
  title: PolyglotModel = new PolyglotModel();

  @observable
  content: PolyglotModel = new PolyglotModel();

  @observable
  relatedUrlList: RelatedUrl[] = [];

  @observable
  depotId: string = '';

  @observable
  privateComment: boolean = false;

  @observable
  commentFeedbackId: string = '';

  @action.bound
  setId(id: string) {
    //
    this.id = id;
  }

  @action.bound
  setTitle(title: PolyglotModel) {
    //
    this.title = title;
  }

  @action.bound
  setContent(content: PolyglotModel) {
    //
    this.content = content;
  }

  @action.bound
  setRelatedUrlList(relatedUrlList: RelatedUrl[]) {
    //
    this.relatedUrlList = relatedUrlList;
  }

  @action.bound
  addRelatedUrlList() {
    //
    this.relatedUrlList.push(RelatedUrlFunc.initialize());
  }

  @action.bound
  setDepotId(depotId: string) {
    //
    this.depotId = depotId;
  }

  @action.bound
  setPrivateComment(privateComment: boolean) {
    //
    this.privateComment = privateComment;
  }

  @action.bound
  setCommentFeedbackId(commentFeedbackId: string) {
    //
    this.commentFeedbackId = commentFeedbackId;
  }

  @action.bound
  findCommentsByQuery() {
    return findCommentsByRdo(CommentRdoFunc.fromCommentQueryModel({...CommentQueryModelFunc.initializer(), feedbackId : this.commentFeedbackId}));
  }

  @action.bound
  getDiscussion() {
    //
    return {
      id: this.id,
      title: this.title,
      content: this.content,
      relatedUrlList: this.relatedUrlList,
      depotId: this.depotId,
      privateComment: this.privateComment,
      commentFeedbackId: this.commentFeedbackId,
    } as CardDiscussion;
  }

  @action.bound
  reset() {
    //
    this.id = '';
    this.title = new PolyglotModel();
    this.content = new PolyglotModel();
    this.relatedUrlList = [RelatedUrlFunc.initialize()];
    this.depotId = '';
    this.privateComment = false;
    this.commentFeedbackId = '';
  }
}

DiscussionModalStore.instance = new DiscussionModalStore();
export default DiscussionModalStore;
