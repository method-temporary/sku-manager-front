import { CommentFeedback } from '../model';
import { axiosApi } from '@nara.platform/accent';
import { AxiosReturn } from '../../../shared/present';

const DEFAULT_URL = '/api/feedback/feedback';

export function findCommentFeedbackById(feedbackId: string): Promise<CommentFeedback> {
  return axiosApi.get(`${DEFAULT_URL}/${feedbackId}/comment`).then(AxiosReturn);
}
