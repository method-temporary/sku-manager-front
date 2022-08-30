import moment from 'moment';
import { Comment } from '../../../../_data/feedback/model/Comment';
import dayjs from 'dayjs';
import { LangStrings } from '../../../../shared/model';

export interface CommentXlsxModel {
  //
  No: string;
  소속사: string;
  '소속조직(팀)': string;
  작성자: string;
  Email: string;
  댓글내용: string;
  등록일: string;
  댓글상태: string;
  댓글관리: string;
}

function fromComment(index: number, comment: Comment): CommentXlsxModel {
  const deleteTime = (comment && comment.deletedTime && dayjs(comment.deletedTime).format('YYYY.MM.DD')) || '-';

  const names = comment && comment.names && new LangStrings(comment.names);

  return {
    No: String(index + 1),
    소속사: comment.companyName || '-',
    '소속조직(팀)': comment.departmentName || '-',
    작성자: names.langStringMap.get(names.defaultLanguage) || '-',
    Email: comment.email || '-',
    댓글내용: comment.message || '-',
    등록일: moment(comment.time).format('YYYY.MM.DD') || '-',
    댓글상태: comment.deleted ? '삭제' : '정상',
    댓글관리: comment.deleted === true ? '삭제 | ' + deleteTime + ' | ' + comment.deleter.name : '-',
  };
}

export const CommentXlsxModelFunc = { fromComment };
