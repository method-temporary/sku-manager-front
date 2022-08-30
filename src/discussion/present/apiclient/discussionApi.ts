import { axiosApi as axios } from 'shared/axios/Axios';
import Discussion from '../../model/Discussion';

class DiscussionApi {
  //

  static instance: DiscussionApi;

  URL = '/api/feedback';
  CARD_URL = '/api/lecture/cards';

  findDiscussion(feedbackId: string): Promise<Discussion> {
    return (
      axios
        // .get<Discussion>(`${this.URL}/feedback/${feedbackId}/discussion`)
        .get<Discussion>(`${this.CARD_URL}/cardDiscussion/${feedbackId}`)
        .then((response) => response && response.data && response.data)
    );
  }

  registerDiscussion(discussion: Discussion): Promise<string> {
    return axios
      .post<string>(`${this.URL}/feedback/discussion`, discussion)
      .then((response) => response && response.data && response.data);
  }

  modifyDiscussion(feedbackId: string, discussion: Discussion): Promise<any> {
    return axios
      .put<string>(`${this.URL}/feedback/${feedbackId}/discussion`, discussion)
      .then((response) => response && response.data && response.data);
  }
}

DiscussionApi.instance = new DiscussionApi();
export default DiscussionApi;
