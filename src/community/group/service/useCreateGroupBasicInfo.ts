import * as React from 'react';
import { autorun } from 'mobx';
import Group from '../model/Group';
import GroupStore from '../mobx/GroupStore';
import { registerGroup, findGroup, modifyGroup, removeGroup } from '../api/GroupApi';
import GroupCdoModel from '../model/GroupCdoModel';
import { findGroupMemberAdmin } from 'community/groupMember/api/GroupMemberApi';
import GroupMemberCdoModel from 'community/groupMember/model/GroupMemberCdoModel';
import GroupMember from 'community/groupMember/model/GroupMember';

export function useCreateGroupBasicInfo(): [
  Group | undefined,
  () => void,
  (name: string, value: any) => void,
  GroupCdoModel | undefined,
  (communityId: string, groupId: string) => void,
  () => void
] {
  const groupStore = GroupStore.instance;
  const [value, setValue] = React.useState<Group | undefined>(groupStore.selected);
  const [groupCdo, setGroupCdo] = React.useState<GroupCdoModel | undefined>(groupStore.selectedGroupCdo);

  React.useEffect(() => {
    return autorun(() => {
      setValue({ ...groupStore.selected });
    });
  }, [groupStore.selected]);

  React.useEffect(() => {
    return autorun(() => {
      setGroupCdo({ ...groupStore.selectedGroupCdo });
    });
  }, [groupStore.selectedGroupCdo, groupStore.selectedGroupCdo.managerName]);

  const changeGroupCdoProps = React.useCallback((name: string, value: any) => {
    //value.length 체크를 위해 any 처리
    if (name === 'name' && value.length > 100) {
      return;
    }

    if (name === 'description' && value.length > 100) {
      return;
    }

    if (value === '전체') value = '';

    groupStore.setGroupCdo(groupStore.selectedGroupCdo, name, value);
  }, []);

  const saveGroup = React.useCallback(async () => {
    groupCdo?.groupId && groupCdo?.groupId !== ''
      ? await modifyGroup(groupCdo?.groupId, groupStore.selectedGroupCdo).then(groupStore.clearGroupCdo)
      : await registerGroup(groupStore.selectedGroupCdo).then(groupStore.clearGroupCdo);
  }, [groupCdo]);

  const deleteGroup = React.useCallback(async () => {
    if (groupCdo?.groupId && groupCdo?.groupId !== '') {
      removeGroup(groupCdo?.communityId, groupCdo?.groupId).then(groupStore.clearGroupCdo);
    }
  }, [groupCdo]);

  const findGroupById = React.useCallback((communityId: string, groupId: string) => {
    findGroup(communityId, groupId).then((response) => {
      const next = <GroupCdoModel>response;
      groupStore.selectGroupCdo(next);
    });
  }, []);

  const findManagerNameById = React.useCallback(
    (communityId: string, groupId: string) => {
      findGroupMemberAdmin(communityId, groupId).then((response) => {
        const next = <GroupMember>response;
        changeGroupCdoProps('managerName', next.name);
        changeGroupCdoProps('managerId', next.memberId);
        //TODO : 코드 개선 필요, 갱신 문제로 인한 추가
        autorun(() => {
          setValue({ ...groupStore.selected });
        });
      });
    },
    [groupStore]
  );

  const findGroupInfoById = React.useCallback(async (communityId: string, groupId: string) => {
    await findGroupById(communityId, groupId);
    await findManagerNameById(communityId, groupId);
  }, []);

  return [value, saveGroup, changeGroupCdoProps, groupCdo, findGroupInfoById, deleteGroup];
}
