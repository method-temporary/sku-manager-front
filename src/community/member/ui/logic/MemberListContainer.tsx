import { CommunityMemberApprovedType } from 'community/member/model/Member';
import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { useHistory } from 'react-router-dom';
import { useGroupMemberList } from '../../../groupMember/service/useGroupMemberList';
import { useMemberList, clearMemberQuery } from '../../service/useMemberList';
import MemberListView from '../view/MemberListView';

interface MemberListContainerProps
  extends RouteComponentProps<{
    cineroomId: string;
    memberId: string;
    communityId: string;
    groupId: string;
  }> {
  communityId: string;
  state: CommunityMemberApprovedType | null;
  groupId: string;
}

const MemberListContainer: React.FC<MemberListContainerProps> = function MemberListContainer(props) {
  const history = useHistory();

  function routeToMemberCreate() {
    history.push(
      `/cineroom/${props.match.params.cineroomId}/community-management/community/board/member-create/${props.match.params.communityId}`
    );
  }

  function routeToMemberDetail(memberId: string) {
    history.push(
      `/cineroom/${props.match.params.cineroomId}/community-management/community/board/member-detail/${props.match.params.communityId}/${memberId}`
    );
  }

  function routeToMemberList(groupMemberId: string) {
    history.push(
      `/cineroom/${props.match.params.cineroomId}/community-management/community/group/group-detail/${props.match.params.communityId}/${groupMemberId}`
    );
  }

  const [createGroupMembers] = useGroupMemberList();

  const [
    memberList,
    changeMemberQueryProps,
    searchQuery,
    memberQuery,
    sharedService,
    updateMembers,
    rejectMembers,
    updateMemberType
  ] = useMemberList();

  changeMemberQueryProps('communityId', props.communityId);
  changeMemberQueryProps('groupId', props.groupId);
  changeMemberQueryProps('approved', props.state);
  // searchQuery();

  return (
    <MemberListView
      searchQuery={searchQuery}
      memberQueryModel={memberQuery}
      routeToMemberCreate={routeToMemberCreate}
      changeMemberQueryProps={changeMemberQueryProps}
      clearMemberQuery={clearMemberQuery}
      memberList={memberList}
      routeToMemberDetail={routeToMemberDetail}
      routeToMemberList={routeToMemberList}
      sharedService={sharedService}
      state={props.state}
      updateMembers={updateMembers}
      rejectMembers={rejectMembers}
      updateMemberType={updateMemberType}
      groupId={props.match.params.groupId}
      createGroupMembers={createGroupMembers}
    />
  );
};

export default withRouter(MemberListContainer);
