import { useCallback } from "react";
import { PaginationProps } from "semantic-ui-react";
import { setPortletListPage, usePortletList, usePortletListLimit, usePortletListPage } from "../portletList/portletList.stores";

type ReturnType = [
  number,
  number,
  (e: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => void,
]

export function usePortletPagination(): ReturnType {
  const page = usePortletListPage() || 1;
  const limit = usePortletListLimit() || 20;
  const totalCount = usePortletList()?.totalCount || 0;
  const totalPages = Math.floor(totalCount / limit) + 1;

  const onPageChange = useCallback((_: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
    const nextPageNo = data.activePage as number;
    setPortletListPage(nextPageNo);
  }, [])

  return [page, totalPages, onPageChange];
}