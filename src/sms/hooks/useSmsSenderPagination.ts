import { useCallback } from 'react';
import { PaginationProps } from 'semantic-ui-react';
import {
  setSmsSenderListPage,
  useSmsSenderListLimit,
  useSmsSenderListPage,
  useSmsSenderDisplayListViewModel,
  initSmsSenderListLimit,
} from 'sms/store/SmsSenderStore';

type ReturnType = [number, number, (e: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => void];

export function useSmsSenderPagination(): ReturnType {
  const page = useSmsSenderListPage() || 1;
  const limit = useSmsSenderListLimit() || initSmsSenderListLimit;
  const senderList = useSmsSenderDisplayListViewModel();
  const totalCount = senderList?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / limit) || 1;

  const onPageChange = useCallback((_: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
    const nextPageNo = data.activePage as number;
    setSmsSenderListPage(nextPageNo);
  }, []);

  return [page, totalPages, onPageChange];
}
