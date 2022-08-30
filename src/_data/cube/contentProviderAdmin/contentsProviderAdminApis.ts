import { ContentProviderContentQdo } from './model/ContentProviderContentQdo';
import { axiosApi as axios } from 'shared/axios/Axios';
import { AxiosReturn } from '../../../shared/present/apiclient/AxiosReturn';
import { OffsetElementList } from '../../../shared/model';
import { ContentProviderContent } from './model/ContentProviderContent';

const CONTENTS_PROVIDER_ADMIN_URL = '/api/cube/contentsProviders/admin';

export function findContentProviderContents(
  contentProviderContentQdo: ContentProviderContentQdo
): Promise<OffsetElementList<ContentProviderContent>> {
  //
  const url = `${CONTENTS_PROVIDER_ADMIN_URL}`;
  return axios.get(url, { params: contentProviderContentQdo }).then(AxiosReturn);
}
