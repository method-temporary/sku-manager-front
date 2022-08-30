import { useCallback } from 'react';
import { PaginationProps } from 'semantic-ui-react';
import {
  setSmsMainNumberListPage,
  useSmsMainNumberListLimit,
  useSmsMainNumberListPage,
  useSmsMainNumberListViewModel,
} from 'sms/store/SmsMainNumberStore';

type ReturnType = [number, number, (e: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => void];

export function useSmsMainNumberPagination(): ReturnType {
  const page = useSmsMainNumberListPage() || 1;
  const limit = useSmsMainNumberListLimit() || 20;
  const mainNumberList = useSmsMainNumberListViewModel();
  const totalCount = mainNumberList?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / limit) || 1;

  const onPageChange = useCallback((_: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
    const nextPageNo = data.activePage as number;
    setSmsMainNumberListPage(nextPageNo);
  }, []);

  return [page, totalPages, onPageChange];
}
