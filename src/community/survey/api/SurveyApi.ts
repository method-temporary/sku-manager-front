import { axiosApi as axios } from 'shared/axios/Axios';
import Survey from '../model/Survey';
import SurveyRdo from '../model/SurveyRdo';

const BASE_URL = '/api/community';

export function findAllSurveyByQuery(surveyRdo: SurveyRdo): Promise<any> {
  return axios.get<Survey[]>(`${BASE_URL}/${surveyRdo.communityId}/menus/survey`, {
    params: surveyRdo,
  });
}
