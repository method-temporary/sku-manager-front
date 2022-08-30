import { useCallback } from "react";
import { PaginationProps } from "semantic-ui-react";
import { getInitialTestListLimit, useTestListLimit } from "exam/store/TestListLimitStore";
import { setTestListPage, useTestListPage } from "exam/store/TestListPageStore";
import { useTestListViewModel } from "exam/store/TestListStore";
import { getInitialTestListViewModel } from "exam/viewmodel/TestListViewModel";

type ReturnType = [
  number,
  number,
  (e: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => void,
]

export function useTestPagination(): ReturnType {
  const testListPage = useTestListPage() || 1;
  const limit = useTestListLimit() || getInitialTestListLimit();
  const { totalCount } = useTestListViewModel() || getInitialTestListViewModel();
  const totalPages = Math.floor(totalCount / limit) + 1;

  const onPageChange = useCallback((_: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
    const nextPageNo = data.activePage as number;
    setTestListPage(nextPageNo);
  }, [])

  return [testListPage, totalPages, onPageChange];
}