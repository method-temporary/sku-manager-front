import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { useHistory } from 'react-router-dom';
import { useGroupList } from '../../service/useGroupList';
import GroupListView from '../view/GroupListView';

interface GroupListContainerProps
  extends RouteComponentProps<{
    cineroomId: string;
    groupId: string;
    communityId: string;
  }> {
  communityId: string;
}

const GroupListContainer: React.FC<GroupListContainerProps> = function GroupListContainer(
  props
) {
  const history = useHistory();

  function routeToGroupCreate() {
    history.push(
      `/cineroom/${props.match.params.cineroomId}/community-management/community/group/group-create/${props.match.params.communityId}`
    );
  }

  function routeToGroupDetail(groupId: string) {
    history.push(
      `/cineroom/${props.match.params.cineroomId}/community-management/community/group/group-detail/${props.match.params.communityId}/${groupId}`
    );
  }

  const [
    groupList,
    changeGroupQueryProps,
    searchQuery,
    groupQuery,
    clearGroupQuery,
    sharedService,
  ] = useGroupList();

  changeGroupQueryProps('communityId', props.communityId);
  // searchQuery();

  return (
    <GroupListView
      searchQuery={searchQuery}
      groupQueryModel={groupQuery}
      routeToGroupCreate={routeToGroupCreate}
      changeGroupQueryProps={changeGroupQueryProps}
      clearGroupQuery={clearGroupQuery}
      groupList={groupList}
      routeToGroupDetail={routeToGroupDetail}
      sharedService={sharedService}
    />
  );
};

export default withRouter(GroupListContainer);
