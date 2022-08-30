import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { useHistory } from 'react-router-dom';
import { useCreateGroupBasicInfo } from '../../service/useCreateGroupBasicInfo';
import CreateGroupBasicInfoView from '../view/CreateGroupBasicInfoView';
import { useGroupList } from '../../service/useGroupList';

interface CreateGroupBasicInfoContainerProps
  extends RouteComponentProps<{
    cineroomId: string;
    communityId: string;
    groupId: string;
  }> {
  communityId: string;
}
const CreateGroupBasicInfoContainer: React.FC<CreateGroupBasicInfoContainerProps> = function CreateGroupBasicInfoContainer(
  props
) {
  const history = useHistory();
  function routeToGroupList() {
    history.push(
      // `/cineroom/${props.match.params.cineroomId}/community-management/community/community-list`
      `/cineroom/${props.match.params.cineroomId}/community-management/community/group/list/group-list/${props.communityId}`

    );
  }

  const [
    group,
    saveGroup,
    changeGroupCdoProps,
    groupCdo,
    findGroupInfoById,
    deleteGroup,
  ] = useCreateGroupBasicInfo();

  changeGroupCdoProps('communityId', props.match.params.communityId);

  //console.log('props.match.params.groupId', props.match.params.groupId);

  if (group === undefined || groupCdo === undefined) {
    return null;
  } else if (props.match.params.groupId && groupCdo.groupId === '') {
    //console.log('props.match:', props.match);
    findGroupInfoById(
      props.match.params.communityId,
      props.match.params.groupId
    );
    changeGroupCdoProps('groupId', props.match.params.groupId);
  }

  return (
    <CreateGroupBasicInfoView
      routeToGroupList={routeToGroupList}
      saveGroup={saveGroup}
      changeGroupCdoProps={changeGroupCdoProps}
      groupCdo={groupCdo}
      deleteGroup={deleteGroup}
    />
  );
};

export default withRouter(CreateGroupBasicInfoContainer);
