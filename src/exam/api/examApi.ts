import { axiosApi as axios } from '@nara.platform/accent';

import { OffsetElementList } from 'shared/model';
import { AxiosReturn } from 'shared/present';

import { handleCopyExamPaperError } from 'exam/handler/TestErrorHandler';
import { AnswerSheetDetailModel } from 'exam/model/AnswerSheetDetailModel';
import { ExamPaperModel } from 'exam/model/ExamPaperModel';
import { ExamQuestionModel } from 'exam/model/ExamQuestionModel';
import { AnswerSheetUdo } from 'exam/model/sdo/AnswerSheetUdo';
import { CopyExamPaperUdo } from 'exam/model/sdo/CopyExamPaperUdo';
import { ExamPaperAdminRdo } from 'exam/model/sdo/ExamPaperAdminRdo';
import { ExamPaperSdo } from '../model/sdo/ExamPaperSdo';

const BASE_URL = '/api/exam';

function paramsSerializer(paramObj: Record<string, any>) {
  const params = new URLSearchParams();
  for (const key in paramObj) {
    if (paramObj[key] !== undefined) {
      params.append(key, paramObj[key]);
    }
  }
  return params.toString();
}

export function searchExamPapers(
  examPaperAdminRdo: ExamPaperAdminRdo
): Promise<OffsetElementList<ExamPaperModel> | undefined> {
  const url = `${BASE_URL}/examPapers/admin/search`;
  return axios
    .get<OffsetElementList<ExamPaperModel>>(url, {
      params: examPaperAdminRdo,
    })
    .then(AxiosReturn);
}

export function findExamPaper(examPaperId: string): Promise<ExamPaperModel | undefined> {
  const url = `${BASE_URL}/examPapers/admin/${examPaperId}`;
  return axios.get<ExamPaperModel>(url).then(AxiosReturn);
}

export function findExamPaperByIds(examPaperIds: string[]) {
  const url = `${BASE_URL}/examPapers/admin/byIds`;
  return axios
    .get<ExamPaperModel[]>(url, {
      params: {
        examPaperIds,
      },
      paramsSerializer,
    })
    .then(AxiosReturn);
}

export function findExamQuestions(examPaperId: string): Promise<ExamQuestionModel[] | undefined> {
  const url = `${BASE_URL}/examPapers/admin/${examPaperId}/questions`;
  return axios.get<ExamQuestionModel[]>(url).then(AxiosReturn);
}

export function findAnswerSheetDetail(studentDenizenId: string, lectureId: string) {
  const url = `${BASE_URL}/answersheets/admin/detail`;
  return axios
    .get<AnswerSheetDetailModel>(url, {
      params: {
        studentDenizenId,
        lectureId,
      },
    })
    .then(AxiosReturn);
}

export function registerExamPaper(examPaperSdo: ExamPaperSdo): Promise<string> {
  //
  const url = `${BASE_URL}/examPapers/admin`;
  return axios.post(url, examPaperSdo).then(AxiosReturn);
}

export function copyExamPaper(examPaperId: string, copyExamPaperUdo: CopyExamPaperUdo): Promise<string | undefined> {
  const url = `${BASE_URL}/examPapers/admin/${examPaperId}/copy`;
  return axios
    .post<string>(url, copyExamPaperUdo)
    .then(AxiosReturn)
    .catch((error) => handleCopyExamPaperError(error));
}

export function updateExamPaper(testId: string, examPaperSdo: ExamPaperSdo) {
  //
  const url = `${BASE_URL}/examPapers/admin/${testId}`;
  return axios.put(url, examPaperSdo).then(AxiosReturn);
}

export function updateExamPaperFinalCopy(examPaperId: string) {
  const url = `${BASE_URL}/examPapers/admin/${examPaperId}/finalCopy`;
  return axios.put(url).then(AxiosReturn);
}

export function removeExamPaper(examPaperId: string): Promise<string> {
  const url = `${BASE_URL}/examPapers/admin/${examPaperId}`;
  return axios
    .delete(url)
    .then((result) => 'success')
    .catch((error) => 'fail');
}

export function gradeAnswerSheet(answerSheetUdo: AnswerSheetUdo): Promise<string> {
  const url = `${BASE_URL}/answersheets/admin/grade`;
  return axios
    .put<string>(url, answerSheetUdo)
    .then((result) => 'success')
    .catch((error) => 'fail');
}

export function checkDuplicateExamPaperTitle(title: string, examPaperId: string): Promise<boolean> {
  const url = `${BASE_URL}/examPapers/admin/duplicate`;
  return axios
    .get(url, { params: { examPaperId, title } })
    .then((response) => response.data)
    .catch(() => true);
}
