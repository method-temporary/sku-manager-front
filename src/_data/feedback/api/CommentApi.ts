import { CommentRdo } from '../model';
import { OffsetElementList } from '../../../shared/model';
import { Comment } from '../model/Comment';
import { axiosApi } from '@nara.platform/accent';

const DEFAULT_URL = '/api/feedback/comments';

export function findCommentsByRdo(commentRdo: CommentRdo): Promise<OffsetElementList<Comment>> {
  return axiosApi
    .put<OffsetElementList<Comment>>(`${DEFAULT_URL}/bySearch`, commentRdo)
    .then((response) => (response && response.data) || new OffsetElementList());
}
