import { QueryKey, QueryOptions } from 'react-query/types/core/types';
import { useQuery, useQueryClient } from 'react-query';
import { useEffect } from 'react';
import { OffsetElementList } from '../model';

export function usePaginationQuery<T, TQueryKey extends QueryKey = QueryKey>(
  queryKey: TQueryKey,
  queryFn: () => Promise<OffsetElementList<T> | undefined>,
  options: { keepPreviousData: boolean; staleTime: number }
) {
  const queryClient = useQueryClient();
  const { data, isFetching } = useQuery(queryKey, queryFn, {
    ...options,
    keepPreviousData: true,
  });

  useEffect(() => {
    if (!data?.empty) {
      queryClient.prefetchQuery(queryKey, queryFn);
    }
  }, [data]);

  return { data, isFetching };
}
