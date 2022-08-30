import { axiosApi as axios } from '@nara.platform/accent';
import Community from '../model/Community';
import CommunityCdoModel from '../model/CommunityCdoModel';
import CommunityRdo from '../model/CommunityRdo';
import MemberCdoModel from 'community/member/model/MemberCdoModel';
import qs from 'qs';

const BASE_URL = '/api/community/communities';

export function findCommunities(limit: number, offset: number): Promise<any> {
  return axios.get<Community[]>(`${BASE_URL}/communityView`, {
    params: { limit, offset },
  });
}

export function findAllCommunityByQuery(communityRdo: CommunityRdo): Promise<any> {
  return (
    axios
      //.get<Community[]>(`${BASE_URL}` + `/searchKey`, {
      .get<Community[]>(`${BASE_URL}/communityView`, {
        params: communityRdo,
      })
  );
}

export function findAllCommunityByQueryAdmin(communityRdo: CommunityRdo): Promise<any> {
  return (
    axios
      //.get<Community[]>(`${BASE_URL}` + `/searchKey`, {
      .get<Community[]>(`${BASE_URL}/communityView/admin`, {
        params: communityRdo,
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: 'comma' });
        },
      })
  );
}

export function findAllCohortCommunities(communityRdo: CommunityRdo): Promise<any> {
  return axios.get<Community[]>(
    `${BASE_URL}/communityView/admin/cohort?offset=${communityRdo.offset}&limit=${communityRdo.limit}`,
    {
      //params: { limit, offset },
    }
  );
}

export function findAllOpenCommunities(communityRdo: CommunityRdo): Promise<any> {
  return axios.get<Community[]>(`${BASE_URL}/communityView`, {
    params: { limit: communityRdo.limit, offset: communityRdo.offset, type: 'OPEN' },
  });
}

export function findCommunityAdmin(communityId: string): Promise<CommunityCdoModel | undefined> {
  return axios
    .get<CommunityCdoModel>(`${BASE_URL}/communityView/admin/${communityId}`)
    .then((response) => response && response.data);
}

export function findCommunity(communityId: string): Promise<CommunityCdoModel | undefined> {
  return axios
    .get<CommunityCdoModel>(`${BASE_URL}/communityView/detail/${communityId}`)
    .then((response) => response && response.data);
}
export function registerCommunity(CommunityCdoModel: CommunityCdoModel): Promise<string> {
  return axios.post<string>(`${BASE_URL}`, CommunityCdoModel).then((response) => response && response.data);
}
export function modifyCommunity(communityId: string, CommunityCdoModel: CommunityCdoModel): Promise<string> {
  return axios
    .put<string>(`${BASE_URL}/${communityId}`, CommunityCdoModel)
    .then((response) => response && response.data);
}

export function findCommunityByName(communityName: string): Promise<boolean> {
  return axios
    .post<boolean>(`${BASE_URL}/existsByName`, { name: communityName })
    .then((response) => response && response.data);
}

export function removeCommunity(communityId: string): Promise<any> {
  return axios.delete(`${BASE_URL}/${communityId}`);
}

export function registerCommunityAndMember(CommunityCdoModel: CommunityCdoModel, memberIds: String): Promise<string> {
  return axios
    .post<string>(`${BASE_URL}/flow?memberIds=${memberIds}`, CommunityCdoModel)
    .then((response) => response && response.data);
}

export function modifyCommunityAndMember(
  communityId: string,
  CommunityCdoModel: CommunityCdoModel,
  memberIds: String
): Promise<string> {
  return axios
    .put<string>(`${BASE_URL}/flow/${CommunityCdoModel.communityId}?memberIds=${memberIds}`, CommunityCdoModel)
    .then((response) => response && response.data);
}
