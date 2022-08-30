import { axiosApi as axios } from 'shared/axios/Axios';
import GroupMember from '../model/GroupMember';
import GroupMemberCdoModel from '../model/GroupMemberCdoModel';
import GroupMemberRdo from '../model/GroupMemberRdo';

const BASE_URL = '/api/community/communities';

export function findCommunities(limit: number, offset: number): Promise<any> {
  return axios.get<GroupMember[]>(`${BASE_URL}`, {
    params: { limit, offset },
  });
}

export function findAllGroupMemberByQuery(groupMemberRdo: GroupMemberRdo): Promise<any> {
  return (
    axios
      //.get<GroupMember[]>(`${BASE_URL}` + `/searchKey`, {
      .get<GroupMember[]>(`${BASE_URL}/${groupMemberRdo.communityId}/${groupMemberRdo.groupId}/members`, {
        params: groupMemberRdo,
      })
  );
}

export function findGroupMember(
  communityId: string,
  groupId: string,
  groupMemberId: string
): Promise<GroupMemberCdoModel | undefined> {
  return axios
    .get<GroupMemberCdoModel>(`${BASE_URL}/${communityId}/${groupId}/members/${groupMemberId}`)
    .then((response) => response && response.data);
}

export function findGroupMemberAdmin(communityId: string, groupId: string): Promise<GroupMember | undefined> {
  return axios
    .get<GroupMember>(`${BASE_URL}/${communityId}/${groupId}/members/admin`)
    .then((response) => response && response.data);
}

export function registerGroupMember(groupId: string, groupMemberCdoModel: GroupMemberCdoModel): Promise<string> {
  return axios
    .post<string>(`${BASE_URL}/${groupMemberCdoModel.communityId}/${groupId}/members`, groupMemberCdoModel)
    .then((response) => response && response.data);
}

export function registerGroupMembers(
  communityId: string,
  groupId: string,
  groupMemberIdList: (string | undefined)[]
): Promise<string> {
  return axios
    .post<string>(`${BASE_URL}/${communityId}/${groupId}/members/flow/${groupMemberIdList.join(',')}`)
    .then((response) => response && response.data);
}

export function modifyGroupMember(
  groupMemberId: string,
  groupId: string,
  groupMemberCdoModel: GroupMemberCdoModel
): Promise<string> {
  return axios
    .put<string>(
      `${BASE_URL}/${groupMemberCdoModel.communityId}/${groupId}/members/${groupMemberId}`,
      groupMemberCdoModel
    )
    .then((response) => response && response.data);
}

export function modifyGroupMembers(
  communityId: string,
  groupId: string,
  groupMemberIdList: (string | undefined)[]
): Promise<string> {
  return axios
    .put<string>(`${BASE_URL}/${communityId}/${groupId}/members`, groupMemberIdList)
    .then((response) => response && response.data);
}

export function removeGroupMembers(
  communityId: string,
  groupId: string,
  groupMemberIdList: (string | undefined)[]
): Promise<any> {
  return axios.delete(`${BASE_URL}/${communityId}/${groupId}/members/flow/${groupMemberIdList.join(',')}`);
}

export function removeGroupMember(communityId: string, groupId: string, groupMemberId: string): Promise<any> {
  return axios.delete(`${BASE_URL}/${groupId}/${communityId}/members/${groupMemberId}`);
}

export function modifyGroupMemberAdmin(communityId: string, groupId: string, groupMemberId: string): Promise<string> {
  return axios
    .put<string>(`${BASE_URL}/${communityId}/${groupId}/members/flow/${groupMemberId}`)
    .then((response) => response && response.data);
}
