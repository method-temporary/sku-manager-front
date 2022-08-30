import { useMutation, useQuery, useQueryClient, UseQueryResult } from 'react-query';
import { CpContent } from '../../../../_data/contentProvider/cpContent/model/CpContent';
import { queryKeys } from '../../../../query/queryKeys';
import {
  findLinkedInContentByUrn,
  registerLinkedInContentByUrn,
} from '../../../../_data/contentProvider/cpContent/CpContentApis';

export const useFindLinkedInContentByUrn = (urn: string): UseQueryResult<CpContent, unknown> => {
  return useQuery(queryKeys.findLinkedInContentByUrn(urn), () => findLinkedInContentByUrn(urn), {
    enabled: urn !== '',
  });
};

export const useRegisterLinkedInContentByUrn = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (urn: string) => {
      return registerLinkedInContentByUrn(urn);
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('findContentProviderContents');
      },
    }
  );
};
