import { axiosApi as axios } from 'shared/axios/Axios';
import Member from '../model/Member';
import SurveyMemberRdo from '../model/SurveyMemberRdo';

const BASE_URL = '/api/community/communities';

export function findAllSurveyAnswerSheetsByQuery(surveyMemberRdo: SurveyMemberRdo): Promise<any> {
  return axios.get<Member[]>(`${BASE_URL}/${surveyMemberRdo.communityId}/members/flow/answerSheets`, {
    params: surveyMemberRdo,
  });
}
