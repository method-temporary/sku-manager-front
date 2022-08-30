import { useCallback } from "react";
import { PaginationProps } from "semantic-ui-react";
import { useSmsListLimit } from "sms/store/SmsListLimitStore";
import { setSmsListPage, useSmsListPage } from "sms/store/SmsListPageStore";
import { useSmsListViewModel } from "sms/store/SmsListStore";
import { initSmsListViewModel } from "sms/viewmodel/SmsListViewModel";

type ReturnType = [
  number,
  number,
  (e: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => void,
]

export function useSmsPagination(): ReturnType {
  const page = useSmsListPage() || 1;
  const limit = useSmsListLimit() || 20;
  const { totalCount } = useSmsListViewModel() || initSmsListViewModel();
  const totalPages = Math.floor(totalCount / limit) + 1;

  const onPageChange = useCallback((_: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
    const nextPageNo = data.activePage as number;
    setSmsListPage(nextPageNo);
  }, [])

  return [page, totalPages, onPageChange];
}