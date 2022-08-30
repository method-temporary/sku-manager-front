import { DatePeriod, DatePeriodFunc } from '../../shared';
import dayjs from 'dayjs';

export interface CommentQueryModel {
  offset: number;
  limit: number;
  feedbackId: string;
  denizenKeyStrings: string[];
  period: DatePeriod;
  searchPart: '' | '소속 조직(팀)' | '성명' | 'E-mail' | '소속사';
  searchWord: string;
}

function initializer(): CommentQueryModel {
  return {
    offset: 0,
    limit: 99999999,
    feedbackId: '',
    denizenKeyStrings: [],
    period: DatePeriodFunc.setDatePeriod(0, dayjs().toDate().getTime()),
    searchPart: '',
    searchWord: '',
  };
}

export const CommentQueryModelFunc = { initializer };
