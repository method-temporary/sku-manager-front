import { axiosApi as axios } from 'shared/axios/Axios';
import { OffsetElementList } from 'shared/model';
import { AxiosReturn } from 'shared/present';

import { UserIdentityModel } from 'cube/user/model/UserIdentityModel';
import AnswerSheetModel from 'survey/answer/model/AnswerSheetModel';
import { ReviewAnswerModel } from '../model/ReviewAnswerModel';

const SURVEY_URL = '/api/survey/admin';
const REVIEWANSWERS_URL = '/api/survey/admin/reviewAnswers';
const ANSWERSHEETS_URL = '/api/survey/answerSheets';
const USER_URL = '/api/user';

export function findCompleteAnswerSheets(surveyCaseId: string, offset: number, limit: number) {
  const url = `${ANSWERSHEETS_URL}/complete/bySurveyCaseId`;
  return axios
    .getLoader<OffsetElementList<AnswerSheetModel>>(url, {
      params: { surveyCaseId, offset, limit },
    })
    .then(AxiosReturn);
}

export function findReviewAnswersBySurveyCaseId(surveyCaseId: string) {
  const url = `${SURVEY_URL}/reviewAnswers`;
  return axios
    .get<ReviewAnswerModel[]>(url, {
      params: { surveyCaseId },
    })
    .then(AxiosReturn);
}

export function registerDisplayReviewAnswer(evaluationSheetId: string) {
  const url = `${REVIEWANSWERS_URL}/byEvaluationSheetId?evaluationSheetId=${evaluationSheetId}`;
  return axios.post<string>(url).then(AxiosReturn);
}

export function removeDisplayReviewAnswer(reviewAnswerId: string) {
  const url = `${REVIEWANSWERS_URL}/${reviewAnswerId}`;
  return axios.delete(url).then(AxiosReturn);
}

export function findUsersByDenizenIds(ids: string[]) {
  return axios.post<UserIdentityModel[]>(`${USER_URL}/users/byDenizenIds`, ids).then(AxiosReturn);
}
