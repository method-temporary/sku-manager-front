import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { useHistory } from 'react-router-dom';
import { useCommunityList } from '../../service/useCommunityList';
import CommunityListView from '../view/CommunityListView';
import { useFieldList } from '../../../field/service/useFieldList';

interface CommunityListContainerProps extends RouteComponentProps<{ cineroomId: string; postId: string }> {}

const CommunityListContainer: React.FC<CommunityListContainerProps> = function CommunityListContainer(props) {
  const [fieldList] = useFieldList();

  const history = useHistory();
  function routeToCommunityCreate() {
    history.push(`/cineroom/${props.match.params.cineroomId}/community-management/community/community-create`);
  }

  function routeToCommunityDetail(communityId: string) {
    history.push(
      `/cineroom/${props.match.params.cineroomId}/community-management/community/community-detail/${communityId}`
    );
  }

  const [
    communityList,
    changeCommunityQueryProps,
    searchQuery,
    communityQuery,
    clearCommunityQuery,
    selectField,
    sharedService,
    onSaveAccessRule,
    clearGroupBasedRules,
  ] = useCommunityList();

  return (
    <CommunityListView
      searchQuery={searchQuery}
      communityQueryModel={communityQuery}
      routeToCommunityCreate={routeToCommunityCreate}
      changeCommunityQueryProps={changeCommunityQueryProps}
      type={communityQuery.type}
      isOpend={communityQuery.isOpend}
      field={communityQuery.field}
      clearCommunityQuery={clearCommunityQuery}
      selectField={selectField(fieldList)}
      communityList={communityList}
      routeToCommunityDetail={routeToCommunityDetail}
      sharedService={sharedService}
      onSaveAccessRule={onSaveAccessRule}
      clearGroupBasedRules={clearGroupBasedRules}
    />
  );
};

export default withRouter(CommunityListContainer);
