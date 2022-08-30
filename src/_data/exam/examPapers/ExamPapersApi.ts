import { axiosApi as axios } from 'shared/axios/Axios';

import { OffsetElementList } from 'shared/model';
import { AxiosReturn } from 'shared/present';

import { ExamPaperModel } from 'exam/model/ExamPaperModel';
import { ExamPaperAdminRdo } from 'exam/model/sdo/ExamPaperAdminRdo';

const ADMIN_URL = '/api/exam/examPapers/admin';

export function findExamPapers(examPaperAdminRdo: ExamPaperAdminRdo): Promise<OffsetElementList<ExamPaperModel>> {
  const url = `${ADMIN_URL}/search`;
  return axios
    .get(url, {
      params: examPaperAdminRdo,
    })
    .then(AxiosReturn);
}
