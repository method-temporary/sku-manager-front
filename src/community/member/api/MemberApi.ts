import { axiosApi as axios } from 'shared/axios/Axios';
import Member from '../model/Member';
import MemberCdoModel from '../model/MemberCdoModel';
import MemberRdo from '../model/MemberRdo';

const BASE_URL = '/api/community/communities';
const MEMBER_VIEW_URL = '/api/community/memberviews';

export function findCommunities(limit: number, offset: number): Promise<any> {
  return axios.get<Member[]>(`${BASE_URL}`, {
    params: { limit, offset },
  });
}

export function findAllMemberByQuery(memberRdo: MemberRdo): Promise<any> {
  return (
    axios
      //.get<Member[]>(`${BASE_URL}` + `/searchKey`, {
      .get<Member[]>(`${MEMBER_VIEW_URL}/${memberRdo.communityId}`, {
        params: memberRdo,
      })
  );
}

export function findMember(communityId: string, memberId: string): Promise<MemberCdoModel | undefined> {
  return axios
    .get<MemberCdoModel>(`${BASE_URL}/${communityId}/members/${memberId}`)
    .then((response) => response && response.data);
}
export function registerMember(memberCdoModel: MemberCdoModel): Promise<string> {
  return axios
    .post<string>(`${BASE_URL}/${memberCdoModel.communityId}/members`, memberCdoModel)
    .then((response) => response && response.data);
}
export function modifyMember(memberId: string, memberCdoModel: MemberCdoModel): Promise<string> {
  return axios
    .put<string>(`${BASE_URL}/${memberCdoModel.communityId}/members/flow/${memberId}`, memberCdoModel)
    .then((response) => response && response.data);
}

export function modifyMembers(communityId: string, memberIdList: (string | undefined)[]): Promise<string> {
  return axios
    .put<string>(`${BASE_URL}/${communityId}/members/flow/${memberIdList.join(',')}`)
    .then((response) => response && response.data);
}

export function removeMembers(communityId: string, memberIdList: (string | undefined)[]): Promise<any> {
  return axios.delete(`${BASE_URL}/${communityId}/members/flow/${memberIdList.join(',')}`);
}

export function removeMember(communityId: string, memberId: string): Promise<any> {
  return axios.delete(`${BASE_URL}/${communityId}/members/${memberId}`);
}

export function companionMembers(
  communityId: string,
  memberIdList: (string | undefined)[],
  remark: string
): Promise<string> {
  return axios
    .put<string>(`${BASE_URL}/${communityId}/members/flow/reject/${memberIdList.join(',')}`, { remark: `${remark}` })
    .then((response) => response && response.data);
}

export function modifyMemberType(
  communityId: string,
  memberIdList: (string | undefined)[],
  memberType: string
): Promise<string> {
  return axios
    .put<string>(`${BASE_URL}/${communityId}/members/memberType/${memberIdList.join(',')}?memberType=${memberType}`)
    .then((response) => response && response.data);
}
