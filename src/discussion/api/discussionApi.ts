import { axiosApi as axios, NameValueList } from '@nara.platform/accent';
import Discussion from 'discussion/model/Discussion';

const BASE_URL = '/api/feedback';

export function findDiscussion(feedbackId: string): Promise<Discussion> {
  return axios
    .get<Discussion>(`${BASE_URL}/feedback/${feedbackId}/discussion`)
    .then((response) => response && response.data && response.data);
}

export function registerDiscussion(
  discussion: Discussion
): Promise<string> {
  return axios
    .post<string>(`${BASE_URL}/feedback/discussion`, discussion)
    .then((response) => response && response.data && response.data);
}

export function modifyDiscussion(
  feedbackId: string,
  discussion: Discussion
): Promise<any> {
  return axios
    .put<string>(`${BASE_URL}/feedback/${feedbackId}/discussion`, discussion)
    .then((response) => response && response.data && response.data);
}

export function findDiscussionFeedBack(
  commentFeedbackId: string
): Promise<any> {
  return axios
    .get(`${BASE_URL}/feedback/${commentFeedbackId}/comment`)
    .then(response => response && response.data && response.data);
}

