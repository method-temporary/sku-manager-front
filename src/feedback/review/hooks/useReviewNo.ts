import { useMemo } from 'react';
import { useReviewListLimit, useReviewListPage, useReviewListViewModel } from '../store/ReviewStore';

export function useReviewNo() {
  const reviewList = useReviewListViewModel();
  const page = useReviewListPage();
  const limit = useReviewListLimit();
  const reviewNo = useMemo(() => {
    if (reviewList?.totalCount === undefined || page === undefined || limit === undefined) {
      return 1;
    }

    return reviewList.totalCount - (page - 1) * limit;
  }, [reviewList?.totalCount, page, limit]);

  return reviewNo;
}
