import { NewDatePeriod } from '../../../shared/model';
import dayjs from 'dayjs';
import { CommentQueryModel } from './CommentQueryModel';

export interface CommentRdo {
  companyName: string;
  denizenKeyStrings: string[];
  departmentName: string;
  email: string;
  endDate: number;
  feedbackId: string;
  limit: number;
  name: string;
  offset: number;
  startDate: number;
}

function fromCommentQueryModel(queryModel: CommentQueryModel): CommentRdo {
  //
  return {
    ...queryModel,
    email: (queryModel.searchPart === 'E-mail' && queryModel.searchWord) || '',
    name: (queryModel.searchPart === '성명' && queryModel.searchWord) || '',
    companyName: (queryModel.searchPart === '소속사' && queryModel.searchWord) || '',
    departmentName: (queryModel.searchPart === '소속 조직(팀)' && queryModel.searchWord) || '',
    startDate: dayjs(queryModel.period.startDate).toDate().getTime() || 0,
    endDate: dayjs(queryModel.period.endDate).endOf('day').toDate().getTime(),
  };
}

export const CommentRdoFunc = { fromCommentQueryModel };
