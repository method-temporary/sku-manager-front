import { useMutation } from 'react-query';
import { downloadQuizAnswerExcel } from '../../_data/quiz/quiz/api/QuizAnswerApi';
import { QuizAnswerExcelRdo } from '../../_data/quiz/quiz/model/QuizAnswerExcelRdo';

export function useDownloadQuizAnswerExcel() {
  return useMutation((quizId: string) => downloadQuizAnswerExcel(quizId));
}
