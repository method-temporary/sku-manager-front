import { useState, useCallback, useEffect } from 'react';
import { autorun } from 'mobx';
import { NaOffsetElementList } from 'shared/model';
import { SharedService } from 'shared/present';
import { responseToNaOffsetElementList } from 'shared/helper';
import GroupMember from '../model/GroupMember';
import { GroupMemberQueryModel } from '../model/GroupMemberQueryModel';
import GroupMemberStore from '../mobx/GroupMemberStore';
import {
  findAllGroupMemberByQuery,
  removeGroupMembers,
  modifyGroupMembers,
  registerGroupMembers,
  modifyGroupMemberAdmin,
} from '../api/GroupMemberApi';

export default interface GroupMemberTemp {
  id?: number;
}

export function useGroupMemberList(): [
  (communityId: string, groupId: string, groupMemberIdList: (string | undefined)[]) => void,
  NaOffsetElementList<GroupMember>,
  (name: string, value: any) => void,
  () => void,
  GroupMemberQueryModel,
  () => void,
  SharedService,
  (communityId: string, groupId: string, groupMemberIdList: (string | undefined)[], confirmType: string) => void,
  (communityId: string, groupId: string, groupMemberId: string) => void
] {
  const groupMemberStore = GroupMemberStore.instance;
  const sharedService = SharedService.instance;

  const [valule, setValue] = useState<NaOffsetElementList<GroupMember>>(groupMemberStore.groupMemberList);

  const [query, setQuery] = useState<GroupMemberQueryModel>(groupMemberStore.selectedGroupMemberQuery);

  useEffect(() => {
    searchQuery();
    return autorun(() => {
      setValue({ ...groupMemberStore.groupMemberList });
      setQuery({ ...groupMemberStore.selectedGroupMemberQuery });
    });
  }, [groupMemberStore]);

  const clearGroupMemberQuery = useCallback(() => {
    groupMemberStore.clearGroupMemberQuery();
  }, []);

  const requestFindAllGroupMemberByQuery = useCallback((groupMemberQueryModel: GroupMemberQueryModel) => {
    if (sharedService) {
      if (groupMemberQueryModel.page) {
        changeGroupMemberQueryProps('offset', (groupMemberQueryModel.page - 1) * groupMemberQueryModel.limit);
        changeGroupMemberQueryProps('pageIndex', (groupMemberQueryModel.page - 1) * groupMemberQueryModel.limit);
        sharedService.setPage('groupMember', groupMemberQueryModel.page);
      } else {
        sharedService.setPageMap('groupMember', 0, groupMemberQueryModel.limit);
      }
    }

    findAllGroupMemberByQuery(GroupMemberQueryModel.asGroupMemberRdo(groupMemberQueryModel)).then((response) => {
      const next = responseToNaOffsetElementList<GroupMember>(response);
      //sharedService.setState({ pageIndex: (page - 1) * 20 });
      next.limit = groupMemberQueryModel.limit;
      next.offset = groupMemberQueryModel.offset;
      sharedService.setCount('groupMember', next.totalCount);
      groupMemberStore.setGroupMemberList(next);
    });
  }, []);

  const changeGroupMemberQueryProps = useCallback((name: string, value: any) => {
    if (value === '전체') value = '';

    groupMemberStore.setGroupMemberQuery(groupMemberStore.selectedGroupMemberQuery, name, value);

    // if (name === 'approved') console.log('approved', value); // searchQuery();
  }, []);

  const searchQuery = useCallback(() => {
    groupMemberStore.clearGroupMemberCdo();
    requestFindAllGroupMemberByQuery(groupMemberStore.selectedGroupMemberQuery);
  }, []);

  const createGroupMembers = useCallback(
    (communityId: string, groupId: string, groupMemberIdList: (string | undefined)[]) => {
      registerGroupMembers(communityId, groupId, groupMemberIdList).then((response) => {
        searchQuery();
      });
    },
    []
  );

  const updateGroupMembers = useCallback(
    (communityId: string, groupId: string, groupMemberIdList: (string | undefined)[], confirmType: string) => {
      confirmType === 'remove'
        ? removeGroupMembers(communityId, groupId, groupMemberIdList).then((response) => {
            searchQuery();
          })
        : modifyGroupMembers(communityId, groupId, groupMemberIdList).then((response) => {
            searchQuery();
          });
    },
    []
  );

  const updateGroupMemberAdmin = useCallback((communityId: string, groupId: string, groupMemberId: string) => {
    modifyGroupMemberAdmin(communityId, groupId, groupMemberId).then((response) => {
      searchQuery();
    });
  }, []);

  return [
    createGroupMembers,
    valule,
    changeGroupMemberQueryProps,
    searchQuery,
    query,
    clearGroupMemberQuery,
    sharedService,
    updateGroupMembers,
    updateGroupMemberAdmin,
  ];
}
