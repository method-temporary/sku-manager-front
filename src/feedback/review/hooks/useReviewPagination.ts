import { useCallback } from 'react';
import { PaginationProps } from 'semantic-ui-react';
import {
  setReviewListPage,
  useReviewListLimit,
  useReviewListPage,
  initReviewListLimit,
  useReviewListViewModel,
} from '../store/ReviewStore';

type ReturnType = [number, number, (e: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => void];

export function useReviewPagination(): ReturnType {
  const page = useReviewListPage() || 1;
  const limit = useReviewListLimit() || initReviewListLimit;
  const reviewList = useReviewListViewModel();
  const totalCount = reviewList?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / limit) || 1;

  const onPageChange = useCallback((_: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
    const nextPageNo = data.activePage as number;
    setReviewListPage(nextPageNo);
  }, []);

  return [page, totalPages, onPageChange];
}
