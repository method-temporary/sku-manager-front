import { ContentProviderContentQdo } from '../../_data/cube/contentProviderAdmin/model/ContentProviderContentQdo';
import { useQuery, UseQueryResult } from 'react-query';
import { queryKeys } from '../../query/queryKeys';
import { findContentProviderContents } from '../../_data/cube/contentProviderAdmin/contentsProviderAdminApis';
import { OffsetElementList } from '../../shared/model';
import { ContentProviderContent } from '../../_data/cube/contentProviderAdmin/model/ContentProviderContent';

export const useFindContentProviderContents = (
  contentProviderContentQdo: ContentProviderContentQdo
): UseQueryResult<OffsetElementList<ContentProviderContent>, unknown> => {
  return useQuery(queryKeys.findContentProviderContents(contentProviderContentQdo), () =>
    findContentProviderContents(contentProviderContentQdo)
  );
};
