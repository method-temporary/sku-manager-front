import { useQuery, UseQueryResult } from 'react-query';

import { OffsetElementList } from 'shared/model';

import { findExamPapers } from '_data/exam/examPapers/ExamPapersApi';

import { queryKeys } from 'query/queryKeys';
import { ExamPaperAdminRdo } from 'exam/model/sdo/ExamPaperAdminRdo';
import { ExamPaperModel } from 'exam/model/ExamPaperModel';

export const useFindExamPaper = (
  examPaperAdminRdo: ExamPaperAdminRdo
): UseQueryResult<OffsetElementList<ExamPaperModel>> => {
  //
  return useQuery(queryKeys.findExamPapers(examPaperAdminRdo), () => findExamPapers(examPaperAdminRdo), {
    enabled: examPaperAdminRdo.limit === 10,
  });
};
