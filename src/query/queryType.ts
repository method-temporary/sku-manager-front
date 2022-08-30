import { UseQueryOptions } from 'react-query';
import { QueryKey } from 'react-query/core';
/**
 * @summary useQuery custom hook을 만들 때 options 를 넘기고 싶을때 해당 타입을 사용하면된다.
 * */

export type OmitUseQueryOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> = Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'queryKey' | 'queryFn'>;
