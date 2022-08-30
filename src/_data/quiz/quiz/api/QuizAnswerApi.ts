import { axiosApi } from '@nara.platform/accent';
import { QuizAnswerExcelRdo } from '../model/QuizAnswerExcelRdo';
import { AxiosReturn } from '../../../../shared/present';

const BASE_URL = '/api/quiz/quizQuestionAnswer';

export function downloadQuizAnswerExcel(quizId: string) {
  const url = `${BASE_URL}/download/excel/${quizId}`;
  return axiosApi.get<QuizAnswerExcelRdo[]>(url).then(AxiosReturn);
}
