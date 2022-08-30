import { OffsetElementList } from '@nara.platform/accent';
import { axiosApi as axios } from 'shared/axios/Axios';
import { patronInfo } from '@nara.platform/dock';
import { CommentModel } from '../../model/CommentModel';
import { SubCommentModel } from '../../model/SubCommentModel';
import { CommentRdo } from '../../model/CommentRdo';
import { FeedbackCdo } from '../../model/FeedbackCdo';
import { CommentFeedbackModel } from '../../model/CommentFeedbackModel';
import { setExcelHistoryParams } from 'shared/components/SubActions/sub/ExcelButton/store/ExcelHistoryStore';

export default class CommentApi {
  URL = '/api/feedback/comments';

  static instance: CommentApi;

  findComments(commentRdo: CommentRdo) {
    //
    return axios
      .put<OffsetElementList<CommentModel>>(this.URL + `/bySearch`, commentRdo)
      .then((response) => (response && response.data) || null);
  }

  findCommentsForExcel(commentRdo: CommentRdo) {
    //
    const apiUrl = this.URL + `/excelBySearch`;

    setExcelHistoryParams({
      searchUrl: apiUrl,
      searchParam: commentRdo,
      workType: 'Excel Download'
    })

    return axios
      .putLoader<CommentModel[]>(apiUrl, commentRdo)
      .then(
        (response) =>
          (response && response.data && response.data.map((comment: CommentModel) => new CommentModel(comment))) || null
      );
  }

  findSubComments(commentId: string, offset: number = 0, limit: number = 20, ascending: boolean = true) {
    //
    return axios
      .get<OffsetElementList<SubCommentModel>>(
        this.URL + `/${commentId}/sub-comments?offset=${offset}&limit=${limit}&ascending=${ascending}`
      )
      .then((response) => (response && response.data) || null);
  }

  removeComment(commentId: string) {
    return axios.delete(this.URL + `/${commentId}`);
  }

  removeSubComment(commentId: string, subCommentId: string | number) {
    const url = typeof subCommentId === 'string' ? `${subCommentId}` : `sequence/${subCommentId}`;
    return axios
      .delete(this.URL + `/${commentId}/sub-comments/${url}`)
      .then((response) => (response && response.data) || null);
  }

  registerCommentFeedback(feedbackCdo: FeedbackCdo) {
    //
    return axios
      .post<string>('/api/feedback/feedback/comment', feedbackCdo)
      .then((response) => (response && response.data) || '');
  }

  findCommentFeedback(feedbackId: string) {
    return axios
      .get<CommentFeedbackModel>(`/api/feedback/feedback/${feedbackId}/comment`)
      .then((response) => (response && response.data) || '');
  }
}

Object.defineProperty(CommentApi, 'instance', {
  value: new CommentApi(),
  writable: false,
  configurable: false,
});
