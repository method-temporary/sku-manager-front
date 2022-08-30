import { useCreateGroupBasicInfo } from 'community/group/service/useCreateGroupBasicInfo';
import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { useHistory } from 'react-router-dom';
import { useGroupMemberList } from '../../service/useGroupMemberList';
import GroupMemberListView from '../view/GroupMemberListView';

interface GroupMemberListContainerProps
  extends RouteComponentProps<{
    cineroomId: string;
    groupId: string;
    communityId: string;
  }> {
  communityId: string | undefined;
}

const GroupMemberListContainer: React.FC<GroupMemberListContainerProps> = function GroupMemberListContainer(props) {
  const history = useHistory();

  function routeToGroupMemberCreate() {
    history.push(
      `/cineroom/${props.match.params.cineroomId}/community-management/community/board/groupMember-create/${props.match.params.communityId}`
    );
  }

  function routeToGroupMemberDetail(groupMemberId: string) {
    history.push(
      `/cineroom/${props.match.params.cineroomId}/community-management/community/board/groupMember-detail/${props.match.params.communityId}/${groupMemberId}`
    );
  }

  function routeToMemberList(groupMemberId: string) {
    history.push(
      `/cineroom/${props.match.params.cineroomId}/community-management/community/group/group-detail/${props.match.params.communityId}/${groupMemberId}`
    );
  }

  const [, , , , findGroupInfoById, ,] = useCreateGroupBasicInfo();

  const [
    createGroupMembers,
    groupMemberList,
    changeGroupMemberQueryProps,
    searchQuery,
    groupMemberQuery,
    clearGroupMemberQuery,
    sharedService,
    updateGroupMembers,
    updateGroupMemberAdmin,
  ] = useGroupMemberList();

  changeGroupMemberQueryProps('communityId', props.communityId);
  changeGroupMemberQueryProps('groupId', props.match.params.groupId);
  // searchQuery();

  return (
    <GroupMemberListView
      searchQuery={searchQuery}
      groupMemberQueryModel={groupMemberQuery}
      changeGroupMemberQueryProps={changeGroupMemberQueryProps}
      clearGroupMemberQuery={clearGroupMemberQuery}
      groupMemberList={groupMemberList}
      routeToMemberList={routeToMemberList}
      sharedService={sharedService}
      updateGroupMembers={updateGroupMembers}
      createGroupMembers={createGroupMembers}
      updateGroupMemberAdmin={updateGroupMemberAdmin}
      findGroupInfoById={findGroupInfoById}
    />
  );
};

export default withRouter(GroupMemberListContainer);
